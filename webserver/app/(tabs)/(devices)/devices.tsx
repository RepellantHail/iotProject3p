import React, { useEffect } from "react";
import { Button, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useSocket } from "@/components/socketCom"; // Import useSocket hook

export default function Devices() {
  const navigation = useNavigation();
  const { sendMessage, connected } = useSocket(); // Use useSocket hook

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleLEDControl = (command: string) => {
    if (connected) {
      console.log("Sending command:", command);
      sendMessage(command); // Send the command to the server via socket
    } else {
      console.log("Socket is not connected.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Devices Screen</ThemedText>
      <Button
        title="Turn LED On"
        onPress={() => handleLEDControl("on")}
        disabled={!connected} // Disable button if socket is not connected
      />
      <Button
        title="Turn LED Off"
        onPress={() => handleLEDControl("off")}
        disabled={!connected} // Disable button if socket is not connected
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
