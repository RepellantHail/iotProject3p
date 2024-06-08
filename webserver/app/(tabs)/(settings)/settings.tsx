import { Stack, useNavigation } from "expo-router";
import { Text, View, StyleSheet, Button, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { BleCommunication } from "./BleCommunication";
import { Device } from "react-native-ble-plx"; // Import BleCommunication component

export default function Settings() {
  const navigation = useNavigation();
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);

  const renderItem = ({ item }: { item: Device }) => (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceText}>{item.name}</Text>
      {/* Optional: Add button to connect to the device */}
      {/* <Button title="Connect" onPress={() => connectToDevice(item)} /> */}
    </View>
  );

  // Use BleCommunication component for Bluetooth functionality
  const { scanForDevices, requestBluetoothPermission } = BleCommunication();

  useEffect(() => {
    const subscription = BleCommunication().manager.onStateChange(
      (state: string) => {
        // Specify type for state
        if (state === "PoweredOn") {
          scanForDevices();
          subscription.remove();
        }
      },
      true
    );
    return () => subscription.remove();
  }, []);

  return (
    <ThemedView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <ThemedText style={styles.titleText}> Settings Screen </ThemedText>
      <Button
        title={isScanning ? "Stop Scanning" : "Scan for Devices"}
        onPress={async () => {
          if (!(await requestBluetoothPermission())) {
            return; // Handle permission errors
          }
          scanForDevices();
        }}
        disabled={!(await requestBluetoothPermission())} // Disable button if permissions not granted
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
  baseText: {
    fontFamily: "Cochin",
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
