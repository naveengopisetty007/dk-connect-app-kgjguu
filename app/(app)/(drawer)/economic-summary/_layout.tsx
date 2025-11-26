
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function EconomicSummaryLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Economic Summary',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
