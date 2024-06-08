import React from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Device } from "react-native-ble-plx";
import BleCommunication from "./BleCommunication";

const renderItem = ({ item }: { item: Device }) => {
  return (
    <View>
      <Text>{item.name}</Text>
      {/* Otro contenido del item si es necesario */}
    </View>
  );
};

interface BleCommunicationResult {
  discoveredDevices: Device[]; // Assuming Device is a type defined elsewhere
  isScanning: boolean;
  hasPermission: boolean;
  scanForDevices: () => Promise<void>;
  requestBluetoothPermission: () => Promise<boolean>;
}

export default function Settings() {
  // Assign the BleCommunication result to the defined type
  const bleCommunicationResult: BleCommunicationResult = BleCommunication();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.titleText}>Settings Screen</ThemedText>
      <Button
        title={
          bleCommunicationResult.isScanning
            ? "Stop Scanning"
            : "Scan for Devices"
        }
        onPress={async () => {
          await bleCommunicationResult.requestBluetoothPermission();
          bleCommunicationResult.scanForDevices();
        }}
        disabled={bleCommunicationResult.isScanning}
      />
      {bleCommunicationResult.discoveredDevices.length > 0 && (
        <FlatList
          data={bleCommunicationResult.discoveredDevices}
          renderItem={renderItem}
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
