import { Stack, useNavigation } from "expo-router";
import { Text, View, TextInput, Button, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import socket, { useSocket } from "./socketCom";

export default function Home() {
  const [command, setCommand] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();
  const [message, setMessage] = useState("");

  const { connected, messages, sendMessage } = useSocket();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const sendCommand = () => {
    if (socket && connected) {
      console.log("Enviando comando:", command);
      socket.emit("message", command);
      setCommand(""); // Limpiar el campo de texto después de enviar
    } else {
      console.log("Socket no está conectado.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Home Screen</ThemedText>
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={command}
          onChangeText={(text) => setCommand(text)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ingrese comando (on/off)"
        />
        <Button title="Enviar" onPress={sendCommand} />
      </ThemedView>
      <ThemedText>Connected: {connected ? "Yes" : "No"}</ThemedText>
      <ThemedText>Messages:</ThemedText>
      {messages.map((msg, index) => (
        <ThemedText key={index}>{msg}</ThemedText>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
  },
});
