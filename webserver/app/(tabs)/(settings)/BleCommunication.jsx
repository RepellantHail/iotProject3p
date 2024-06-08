import React, { useState, useEffect } from "react";
import { BleManager, PermissionsAndroid, Platform } from "react-native-ble-plx";

const BleCommunication = () => {
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [bleManager, setBleManager] = useState(null); // Moved this state inside the component

  useEffect(() => {
    const initializeBluetooth = async () => {
      if (Platform.OS === "android") {
        const granted = await requestBluetoothPermission();
        setHasPermission(granted);
      } else {
        setHasPermission(true);
      }
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

  return {
    discoveredDevices,
    isScanning,
    hasPermission, // Export permission state
    scanForDevices,
    requestBluetoothPermission,
  };
};

export default BleCommunication;
