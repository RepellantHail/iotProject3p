import React, { useState, useEffect } from 'react';
import { BleManager } from 'react-native-ble-plx';

export const manager = new BleManager()
const arduinoName = ""; // Replace with your Arduino's name

export const requestBluetoothPermission = async () => {
  // Permission logic here
};

export const scanForDevices = async (setDiscoveredDevices, setIsScanning) => {
  // Scan logic here
};

export const BleCommunication = () => {
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Bluetooth initialization logic here
  }, []);

  return {
    discoveredDevices,
    isScanning,
    hasPermission, // Export permission state
    scanForDevices: () => scanForDevices(setDiscoveredDevices, setIsScanning),
    requestBluetoothPermission: async () => {
      const permission = await requestBluetoothPermission();
      setHasPermission(permission); // Update permission state
    }
  };
};

export default BleCommunication;