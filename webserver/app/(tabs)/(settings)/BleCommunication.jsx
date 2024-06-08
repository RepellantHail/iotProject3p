import React, { useState, useEffect } from "react";
import { BleManager, PermissionsAndroid, Platform } from "react-native-ble-plx";

const BleCommunication = () => {
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [bleManager, setBleManager] = useState(null); // Moved this state inside the component

  useEffect(() => {
    const initializeBluetooth = async () => {
      if (Platform.OS === 'android') {
        const granted = await requestBluetoothPermission();
        setHasPermission(granted);
      } else {
        // For iOS or other platforms, assume permission is granted
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
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.error('Error requesting location permission:', error);
        return false;
      }
    }
    return true;
  };

  const scanForDevices = async () => {
    if (!hasPermission || !bleManager) {
      console.error('Bluetooth manager is not initialized or permission is not granted');
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
        setDiscoveredDevices(prevDevices => [...prevDevices, device]);
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
