import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{ title: "PokéFusion" }}></Stack.Screen>
    <Stack.Screen name="result" options={{ title: "Resultado" }}></Stack.Screen>
  </Stack>;
}
