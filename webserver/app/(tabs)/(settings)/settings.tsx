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
import { Stack, useNavigation } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { Device } from "react-native-ble-plx";
import BleCommunication from "./BleCommunication";
import { deviceIcons, deviceDescriptions } from "./resources";
import FontAwesome from "@expo/vector-icons/FontAwesome";

//Scan list items
const renderItem = ({
  item,
  onPress,
}: {
  item: Device;
  onPress: () => void;
}) => {
  const deviceName = item.name || "Unnamed Device";
  const icon = deviceIcons[deviceName] || (
    <FontAwesome name="question" size={24} color="grey" />
  );
  const description = deviceDescriptions[deviceName] || "Unknown Device";

  return (
    <TouchableOpacity style={styles.deviceItem} onPress={onPress}>
      {icon}
      <View style={{ marginLeft: 10 }}>
        <ThemedText style={styles.deviceText}>{deviceName}</ThemedText>
        <ThemedText style={styles.deviceDescription}>{description}</ThemedText>
      </View>
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
  const navigation = useNavigation();
  // Assign the BleCommunication result to the defined type
  const bleCommunicationResult: BleCommunicationResult = BleCommunication();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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
    paddingTop: 10,
    margin: 10,
    height: "80%",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  deviceList: {
    marginTop: 20,
    width: "80%",
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  deviceText: {
    fontSize: 16,
    flex: 1,
  },
  deviceDescription: {
    fontSize: 12,
    color: "#666",
  },
});
