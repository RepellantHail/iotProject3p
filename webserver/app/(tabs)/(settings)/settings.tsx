import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Device } from "react-native-ble-plx";
import BleCommunication from "./BleCommunication";

const renderItem = ({
  item,
  onPress,
}: {
  item: Device;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.deviceItem} onPress={onPress}>
      <Text style={styles.deviceText}>{item.name || "Unnamed Device"}</Text>
    </TouchableOpacity>
  );
};

interface BleCommunicationResult {
  discoveredDevices: Device[]; // Assuming Device is a type defined elsewhere
  isScanning: boolean;
  hasPermission: boolean;
  scanForDevices: () => Promise<void>;
  requestBluetoothPermission: () => Promise<boolean>;
  connectToDevice: (deviceId: string) => Promise<void>;
}

export default function Settings() {
  // Assign the BleCommunication result to the defined type
  const bleCommunicationResult: BleCommunicationResult = BleCommunication();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeBluetooth = async () => {
      const permissionGranted =
        await bleCommunicationResult.requestBluetoothPermission();
      if (permissionGranted) {
        setInitialized(true);
      }
    };
    initializeBluetooth();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.titleText}>Settings Screen</ThemedText>
      <Button
        title={
          bleCommunicationResult.isScanning
            ? "Stop Scanning"
            : "Scan for Devices"
        }
        onPress={bleCommunicationResult.scanForDevices}
        disabled={bleCommunicationResult.isScanning || !initialized}
      />
      {bleCommunicationResult.discoveredDevices.length > 0 && (
        <FlatList
          data={bleCommunicationResult.discoveredDevices}
          renderItem={({ item }) =>
            renderItem({
              item,
              onPress: () => bleCommunicationResult.connectToDevice(item.id),
            })
          }
          keyExtractor={(item) => item.id}
          style={styles.deviceList}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  deviceList: {
    marginTop: 20,
    width: "80%",
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  deviceText: {
    fontSize: 16,
  },
});
