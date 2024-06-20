import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";

interface Melody {
  name: string;
  duration: number;
}

interface MelodiesProps {
  playMelody: (melodyName: string, duration: number) => void;
}

const melodies: Melody[] = [
  { name: "melody1", duration: 3 },
  { name: "melody2", duration: 5 },
  // Puedes añadir más melodías aquí
];

const Melodies: React.FC<MelodiesProps> = ({ playMelody }) => {
  return (
    <ThemedView style={styles.melodyContainer}>
      {melodies.map((melody, index) => (
        <Button
          key={index}
          title={`Play ${melody.name} (${melody.duration}s)`}
          onPress={() => playMelody(melody.name, melody.duration)}
        />
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  melodyContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 20,
  },
});

export default Melodies;
