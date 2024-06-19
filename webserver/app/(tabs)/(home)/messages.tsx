// Messages.tsx
import React from "react";
import { StyleSheet, FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";

interface MessagesProps {
  messages: string[];
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  // Solo mostramos los últimos 5 mensajes
  const latestMessages = messages.slice(-5);

  return (
    <FlatList
      data={latestMessages}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <ThemedText>{item}</ThemedText>}
    />
  );
};

const styles = StyleSheet.create({
  // Añade estilos si es necesario
});

export default Messages;
