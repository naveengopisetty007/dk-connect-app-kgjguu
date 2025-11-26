
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, router, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "login",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  const segments = useSegments();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (loading || !loaded) return;

    const inAuthGroup = segments[0] === '(app)';

    console.log('RootLayout: Navigation check', { session: !!session, inAuthGroup, segments });

    if (!session && inAuthGroup) {
      console.log('RootLayout: Redirecting to login');
      router.replace('/login');
    } else if (session && !inAuthGroup) {
      console.log('RootLayout: Redirecting to app');
      router.replace('/(app)/(drawer)/(home)');
    }
  }, [session, segments, loading, loaded]);

  if (!loaded || loading) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(52, 152, 219)",
      background: "rgb(245, 245, 245)",
      card: "rgb(255, 255, 255)",
      text: "rgb(51, 51, 51)",
      border: "rgb(224, 224, 224)",
      notification: "rgb(231, 76, 60)",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(52, 152, 219)",
      background: "rgb(18, 18, 18)",
      card: "rgb(28, 28, 30)",
      text: "rgb(229, 229, 231)",
      border: "rgb(44, 44, 46)",
      notification: "rgb(231, 76, 60)",
    },
  };

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="(app)" />
        </Stack>
        <SystemBars style={"auto"} />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" animated />
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </>
  );
}
