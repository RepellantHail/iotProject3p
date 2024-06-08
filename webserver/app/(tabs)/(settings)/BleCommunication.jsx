import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export const manager = new BleManager();

const arduinoName  = ""
const [isScanning, setIsScanning] = useState(false);
const [connectedDevice, setConnectedDevice] = useState(null);
const [discoveredServices, setDiscoveredServices] = useState([]);

const requestBluetoothPermission = async () => {
    if (Platform.OS === 'ios') {
      return true; // No permission request needed for iOS
    }
  
    const apiLevel = parseInt(Platform.Version.toString(), 10);
  
    if (apiLevel >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
  
      return (
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
};

useEffect(() => {
    const subscription = manager.onStateChange(state => {
        if (state === 'PoweredOn') {
        requestBluetoothPermission().then(hasPermission => {
            if (hasPermission) {
                scanForDevices();
            }
        });
    }
});
  
    return () => subscription.remove();
  }, [manager]);

const scanForDevices = async () => {
    setIsScanning(true);
    try {
        await manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
            console.error('Scan error:', error);
            return;
            }
            if (device.name === arduinoName) {
                setIsScanning(false);
                manager.stopDeviceScan();
                connectToDevice(device);
            }
        });
    } catch (error) {
        console.error('Scan error:', error);
        setIsScanning(false);
    }
};
  
const connectToDevice = async (device) => {
    try {
        const connectedDevice = await device.connect();
        setConnectedDevice(connectedDevice);
        await discoverServices(connectedDevice); // Discover services and characteristics
    } catch (error) {
        console.error('Connection error:', error);
    }
};
  
const discoverServices = async (device) => {
    try {
        const services = await device.discoverAllServicesAndCharacteristics();
        setDiscoveredServices(services);

        const serviceUUID = '/* Your Arduino service UUID here */';
        const characteristicUUID = '/* Your Arduino characteristic UUID here */';

        const service = services.find(service => service.uuid === serviceUUID);
        if (service) {
            const characteristic = service.characteristics.find(characteristic => characteristic.uuid === characteristicUUID);
            if (characteristic) {
            } else {
                console.warn('Characteristic not found:', characteristicUUID);
            }
        } else {
            console.warn('Service not found:', serviceUUID);
        }
    } catch (error) {
        console.error('Service discovery error:', error);
    }
};