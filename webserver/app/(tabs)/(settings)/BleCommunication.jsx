import React, { useState, useEffect } from "react";
import {
  BleManager,
  Device,
  PermissionsAndroid,
  Platform,
} from "react-native-ble-plx";

const BleCommunication = () => {
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [bleManager, setBleManager] = useState(null); // Moved this state inside the component

  useEffect(() => {
    const initializeBluetooth = async () => {
      const granted = await requestBluetoothPermission();
      setHasPermission(granted);
    };
    initializeBluetooth();
  }, []);

  useEffect(() => {
    if (hasPermission && !bleManager) {
      const manager = new BleManager();
      setBleManager(manager);
    }
  }, [hasPermission, bleManager]);

  const requestBluetoothPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const apiLevel = parseInt(Platform.Version, 10);
        if (apiLevel < 31) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);
          return (
            granted["android.permission.BLUETOOTH_SCAN"] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted["android.permission.BLUETOOTH_CONNECT"] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted["android.permission.ACCESS_FINE_LOCATION"] ===
              PermissionsAndroid.RESULTS.GRANTED
          );
        }
      } else if (Platform.OS === "ios") {
        return true;
      }
    } catch (error) {
      console.error("Error requesting Bluetooth permission:", error);
      return false;
    }
    return false;
  };

  const scanForDevices = async () => {
    if (!hasPermission || !bleManager) {
      console.error(
        "Bluetooth manager is not initialized or permission is not granted"
      );
      return;
    }

    setIsScanning(true);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        setIsScanning(false);
        return;
      }
      if (device) {
        setDiscoveredDevices((prevDevices) => {
          if (!prevDevices.some((d) => d.id === device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    // Stop scanning after a specified period
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 5000);
  };

  const connectToDevice = async (deviceId) => {
    try {
      const device = await bleManager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected and services discovered:", device);
    } catch (error) {
      console.error("Failed to connect and discover services:", error);
    }
  };

  return {
    discoveredDevices,
    isScanning,
    hasPermission, // Export permission state
    scanForDevices,
    requestBluetoothPermission,
    connectToDevice,
  };
};

export default BleCommunication;
