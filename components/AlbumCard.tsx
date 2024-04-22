import { View, Text, Image, Dimensions, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
const AlbumCard = ({
  album,
  navigation,
}: {
  album: MediaLibrary.Album;
  navigation: any;
}) => {
  const [cover, setCover] = useState<any>();
  const getAlbumCover = async () => {
    const assets = await MediaLibrary.getAssetsAsync({ album: album });
    console.log("🚀 ~ getAlbumCover ~ assets:", assets);
    if (assets.assets && assets?.assets?.length > 0) {
      const imgInfo = await MediaLibrary.getAssetInfoAsync(
        assets.assets?.[0]?.id
      );
      console.log("🚀 ~ getAlbumCover ~ imgInfo:", imgInfo);
      if (imgInfo) {
        setCover(imgInfo.localUri);
      }
    }
  };

  useEffect(() => {
    getAlbumCover();
  }, []);
  return (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed ? 0.72 : 1 }]}
      onPress={() => navigation?.navigate("album-detail", { album: album })}
    >
      <View
        style={{
          gap: 12,
          width: Dimensions.get("screen").width / 3 - 24,
        }}
      >
        <Image
          source={{
            uri: cover,
            width: Dimensions.get("screen").width / 3 - 24,
            height: Dimensions.get("screen").width / 3 - 24,
          }}
        />
        <Text>{album?.title}</Text>
      </View>
    </Pressable>
  );
};

export default AlbumCard;
