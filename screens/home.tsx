import {
  SafeAreaView,
  StyleSheet,
  Button,
  View,
  Text,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlbumCard from "../components/AlbumCard";
const Home = ({ navigation }: { navigation: any }) => {
  const colors = useTheme().colors;
  const [albums, setAlbums] = useState(null);
  const insets = useSafeAreaInsets();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const headerHeight = useHeaderHeight();

  async function getAlbums() {
    if (permissionResponse.status !== "granted") {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });

    setAlbums(fetchedAlbums);
  }

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerTintColor: colors.text,
    });
  }, [navigation, colors]);

  return (
    <ScrollView
      automaticallyAdjustContentInsets
      style={{
        flex: 1,
        // paddingTop: headerHeight,
        width: Dimensions.get("screen").width,
      }}
    >
      <View
        style={[
          styles.container,
          {
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: 12,
            backgroundColor: colors.background,
            paddingBottom: insets.bottom,
            paddingHorizontal: 24,
            paddingTop: headerHeight + insets.top + 32,
          },
        ]}
      >
        {albums?.length > 0 ? (
          albums?.map((a: MediaLibrary.Album, i) => {
            return <AlbumCard navigation={navigation} key={i} album={a} />;
            // return (
            //   <Button
            //     key={i}
            //     color={colors.text}
            //     onPress={() =>
            //       navigation?.navigate("album-detail", { album: a })
            //     }
            //     title={`${a?.title}`}
            //   ></Button>
            // );
          })
        ) : (
          <Pressable
            onPress={getAlbums}
            style={({ pressed }) => [
              {
                backgroundColor: colors.card,
                opacity: pressed ? 0.72 : 1,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 8,
              },
            ]}
          >
            <Text style={{ color: colors.text }}>Get albums</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Home;
