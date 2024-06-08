import React, { useState, useEffect } from "react";
import { BleManager, PermissionsAndroid, Platform } from "react-native-ble-plx";

const BleCommunication = () => {
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [bleManager, setBleManager] = useState(null); // Moved this state inside the component

  useEffect(() => {
    const initializeBluetooth = async () => {
      if (typeof navigator !== "undefined" && "permissions" in navigator) {
        try {
          // Request location permission using Geolocation API
          const permissionStatus = await navigator.permissions.query({
            name: "geolocation",
          });
          if (permissionStatus.state === "granted") {
            setHasPermission(true);
          } else {
            console.error("Geolocation permission denied");
          }
        } catch (error) {
          console.error("Error requesting location permission:", error);
        }
      } else {
        console.error("Geolocation API is not available");
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
    if (typeof window !== "undefined") {
      // Check if Geolocation API is available
      if ("geolocation" in navigator) {
        try {
          // Request location permission using Geolocation API
          await navigator.permissions.request({ name: "geolocation" });
          // Permission granted
          return true;
        } catch (error) {
          console.error("Error requesting location permission:", error);
          // Permission denied or error occurred
          return false;
        }
      } else {
        console.error("Geolocation API is not available");
        // Geolocation API not available
        return false;
      }
    } else {
      console.error("Window object is not available");
      // Window object not available
      return false;
    }
    if (
      Platform.OS === "android" &&
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ) {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      if (
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          result["android.permission.BLUETOOTH_CONNECT"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.BLUETOOTH_SCAN"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.ACCESS_FINE_LOCATION"] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }

      this.showErrorToast("Permission have not been granted");
      return false;
    } else if (Platform.OS === "ios") {
      return true;
    }
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
        setDiscoveredDevices((prevDevices) => [...prevDevices, device]);
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
