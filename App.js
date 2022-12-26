import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as ExpoSplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import SplashScreen from "./components/SplashScreen";

import {
  useGlobalContext,
  GlobalContextProvider,
  PlayContextProvider,
} from "./state";
import Home from "./screens/Home";
import Episodes from "./screens/Episodes";
import { useEffect, useState, useCallback } from "react";
import Player from "./components/Player";
import { View } from "react-native";

const Stack = createNativeStackNavigator();

const stackDefaults = {
  options: {
    headerShown: false,
  },
};

const AppLoading = () => {
  const { state } = useGlobalContext();
  return state?.isLoading ? (
    <SplashScreen />
  ) : (
    <PlayContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen {...stackDefaults} name="Home" component={Home} />
          <Stack.Screen
            {...stackDefaults}
            name="Episodes"
            component={Episodes}
          />
        </Stack.Navigator>
      </NavigationContainer>

      <Player />
    </PlayContextProvider>
  );
};

ExpoSplashScreen.preventAutoHideAsync();

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const images = [require("./assets/logo.png")];

        const cacheImages = images.map((image) => {
          return Asset.fromModule(image).downloadAsync();
        });
        return Promise.all(cacheImages);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      await ExpoSplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <GlobalContextProvider>
        <AppLoading />
      </GlobalContextProvider>
    </View>
  );
}
