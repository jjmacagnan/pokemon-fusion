import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{ title: "Desculpator 3000" }}></Stack.Screen>
  </Stack>;
}
