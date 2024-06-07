import { Stack, useNavigation } from 'expo-router';
import { Text, View } from 'react-native';
import { useEffect } from 'react';

export default function Alarms() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Alarms Screen</Text>
    </View>
  );
}
