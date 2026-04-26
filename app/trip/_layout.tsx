import { Stack } from "expo-router";

export default function TripLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create" />
      <Stack.Screen name="[id]/index" />
      <Stack.Screen name="[id]/add-bill" />
      <Stack.Screen name="[id]/settle" />
    </Stack>
  );
}
