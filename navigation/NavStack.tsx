import * as React from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home";

import AlBumDetail from "../screens/album-detail";
import Images from "../screens/images";
import { useColorScheme } from "react-native";

const Stack = createNativeStackNavigator();

const NavStack = () => {
  const theme = useColorScheme();
  const colors = useTheme().colors;
  return (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerTransparent: true,
            title: "Home",
            headerLargeTitle: true,
            headerBlurEffect: theme === "dark" ? "dark" : "light",

            headerTintColor: theme === "dark" ? colors.text : colors.text,
          }}
        />
        <Stack.Screen
          name="album-detail"
          options={{
            headerBlurEffect: theme === "dark" ? "dark" : "light",
            headerTransparent: true,
            headerLargeTitle: true,
            headerTintColor: theme === "dark" ? colors.text : colors.text,
            title: "Album",
          }}
          component={AlBumDetail}
        />
        <Stack.Screen
          name="images-detail"
          options={{
            title: "Edit images",
            headerBlurEffect: theme === "dark" ? "dark" : "light",
            headerTransparent: true,
            headerTintColor: theme === "dark" ? colors.text : colors.text,

            gestureDirection: "horizontal",
          }}
          component={Images}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavStack;
