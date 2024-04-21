import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Button,
  ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import {
  Canvas,
  Fill,
  ImageShader,
  Rect,
  Shader,
  Skia,
  useImage,
} from "@shopify/react-native-skia";
import { useEffect, useState } from "react";
import { AlbumEntry } from "./components/AlbumEntry";
import NavStack from "./navigation/NavStack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function App() {
  //   const source = Skia.RuntimeEffect.Make(`
  // uniform shader image;

  // half4 main(float2 xy) {
  //   xy.x += sin(xy.y * 8) * 12;
  //   return image.eval(xy).rbga;
  // }`)!;

  const bg = useImage(require("./assets/bg.jpg"));
  if (!bg) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavStack />
    </GestureHandlerRootView>
  );
}
