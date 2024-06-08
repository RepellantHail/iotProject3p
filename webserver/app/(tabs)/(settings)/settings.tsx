import { Stack, useNavigation } from "expo-router";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import * as Network from "expo-network";

export default function Settings() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ThemedView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <ThemedText style={styles.titleText}> Settings Screen </ThemedText>
      <Button
        title="Connect Board"
        onPress={() => Alert.alert("Simple Button pressed")}
      />
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
});
