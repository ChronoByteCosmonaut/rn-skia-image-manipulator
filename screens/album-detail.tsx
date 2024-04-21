import { View, Text, Button, SafeAreaView, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { AlbumEntry } from "../components/AlbumEntry";
import { useTheme } from "@react-navigation/native";

const AlBumDetail = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { album } = route.params;
  const colors = useTheme().colors;
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      title: `${album?.title}`,
      headerTintColor: colors.text,
      headerRight: () =>
        selectedImages && selectedImages?.length > 0 ? (
          <Button
            color={colors.text}
            onPress={() =>
              navigation?.navigate("images-detail", { images: selectedImages })
            }
            title="Next"
          />
        ) : (
          <></>
        ),
    });
  }, [navigation, selectedImages]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AlbumEntry
        setSelectedImages={setSelectedImages}
        key={"default"}
        album={album}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AlBumDetail;
