import { Stack, useNavigation } from "expo-router";
import { Text, View, TextInput, Button, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import io from "socket.io-client";

const socket = io("http://192.168.0.107:3000");

export default function Home() {
  const [command, setCommand] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
      console.log(socket.id); // Log the socket ID (for debugging only)
    };

    const handleDisconnect = (reason: string) => {
      setConnected(false);
      console.log(`Disconnected: ${reason}`);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.on("message", (data: string) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("message");
    };
  }, []);

  const sendCommand = () => {
    if (socket && connected) {
      console.log("Enviando comando:", command);
      socket.emit("message", command);
      setCommand(""); // Limpiar el campo de texto después de enviar
    } else {
      console.log("Socket no está conectado.");
    }
  };

  const sendMessage = () => {
    if (message && socket && connected) {
      socket.emit("message", message);
      setMessage("");
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
