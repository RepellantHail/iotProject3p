import React from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Device } from "react-native-ble-plx";
import {
  BleCommunication,
  requestBluetoothPermission,
} from "./BleCommunication";

const renderItem = ({ item }: { item: Device }) => {
  return (
    <View>
      <Text>{item.name}</Text>
      {/* Otro contenido del item si es necesario */}
    </View>
  );
};

export default function Settings() {
  const { scanForDevices, discoveredDevices, isScanning } = BleCommunication();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.titleText}>Settings Screen</ThemedText>
      <Button
        title={isScanning ? "Stop Scanning" : "Scan for Devices"}
        onPress={async () => {
          await requestBluetoothPermission();
          scanForDevices();
        }}
        disabled={isScanning} // Disable button if scanning is in progress
      />
      {discoveredDevices.length > 0 && (
        <FlatList
          data={discoveredDevices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id} // Assuming devices have unique IDs
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
