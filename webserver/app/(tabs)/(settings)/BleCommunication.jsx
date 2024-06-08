import React, { useState, useEffect } from "react";
import { BleManager } from "react-native-ble-plx";

export const manager = new BleManager();
const arduinoName = ""; // Replace with your Arduino's name

export const requestBluetoothPermission = async () => {
  if (Platform.OS === 'android') {
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
  }
  return true;
};

export const scanForDevices = async (
  setDiscoveredDevices,
  setIsScanning
) => {
  setIsScanning(true);
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.error(error);
      setIsScanning(false);
      return;
    }
    if (device) {
      setDiscoveredDevices((prevDevices) => [...prevDevices, device]);
    }
  });

  // Stop scanning after a specified period
  setTimeout(() => {
    manager.stopDeviceScan();
    setIsScanning(false);
  }, 5000);
};

export const BleCommunication = () => {
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const initializeBluetooth = async () => {
      const permission = await requestBluetoothPermission();
      setHasPermission(permission);
    };
    initializeBluetooth();
  }, []);

  return {
    discoveredDevices,
    isScanning,
    hasPermission, // Export permission state
    scanForDevices: () => scanForDevices(
      setDiscoveredDevices,
      setIsScanning
    ),
    requestBluetoothPermission: async () => {
      const permission = await requestBluetoothPermission();
      setHasPermission(permission); // Update permission state
    },
  };
};

export default BleCommunication;
