import { Stack, useNavigation } from "expo-router";
import { Text, View, TextInput, Button, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function Home() {
  const [command, setCommand] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();

  const sendCommand = () => {
    // Aquí enviarías el comando al servidor a través de Socket.io
    console.log("Enviando comando:", command);
    // Aquí puedes enviar `command` al servidor a través de Socket.io
    // socket.emit('message', command);
    setCommand(""); // Limpiar el campo de texto después de enviar
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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
          placeholder=""
        />
        {
          <ThemedText style={styles.placeholder}>
            {command ? command : "Ingrese comando (on/off)"}
          </ThemedText>
        }
        <Button title="Enviar" onPress={sendCommand} />
      </ThemedView>
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
  placeholder: {
    position: "absolute",
    left: 10,
    top: 10,
  },
});
