import { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import {
  View,
  Text,
  Image as RNImage,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  SlideInDown,
  SlideOutDown,
  SlideOutUp,
  ZoomIn,
  ZoomInDown,
  ZoomOut,
} from "react-native-reanimated";
import { FlashList, MasonryFlashList } from "@shopify/flash-list";
import React from "react";
export function AlbumEntry({ album, setSelectedImages }) {
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  const headerHeight = useHeaderHeight();

  const [selectedAssets, setSelectedAssets] = useState<MediaLibrary.Asset[]>(
    []
  );
  useEffect(() => {
    async function getAlbumAssets() {
      const albumAssets = await MediaLibrary.getAssetsAsync({
        album: album,
        first: 100,
        mediaType: MediaLibrary.MediaType.photo,
      });
      setAssets(albumAssets.assets);
    }
    getAlbumAssets();
  }, [album]);

  const loadMore = async () => {
    if (hasNextPage) {
      const aAssets = await MediaLibrary.getAssetsAsync({
        album: album,
        first: 50,
        mediaType: MediaLibrary.MediaType.photo,
        after: assets[assets?.length - 1]?.id,
      });
      if (aAssets.hasNextPage) {
        setHasNextPage(true);
      } else {
        setHasNextPage(false);
      }
      setAssets((prev) =>
        prev ? [...prev, ...aAssets.assets] : aAssets.assets
      );
    }
  };

  useEffect(() => {
    if (assets?.[0]?.uri) {
      setSelectedAssets([assets?.[0]]);
      setSelectedImages([assets?.[0]]);
    }
  }, [assets]);

  // Step 2: Function to toggle a specific ID in the array
  const toggleAsset = React.useCallback(
    (asset: MediaLibrary.Asset) => {
      // console.log("asset?.id:::", asset?.id);
      console.log("Toddling: ", asset?.id);
      const uris = selectedAssets?.map((v) => v.uri);
      // console.log("🚀 ~ toggleAsset ~ uris:", uris);

      if (uris.includes(asset.uri)) {
        setSelectedAssets(selectedAssets.filter((v) => v.uri !== asset.uri));
        setSelectedImages(selectedAssets.filter((v) => v.uri !== asset.uri));
      } else {
        // If the ID is not selected, add it
        setSelectedAssets((prev) => (prev ? [...prev, asset] : [asset]));
        setSelectedImages((prev) => (prev ? [...prev, asset] : [asset]));
      }
    },
    [selectedAssets]
  );

  useEffect(() => {
    console.log(
      "SelectedAssets:::",
      selectedAssets?.map((v) => v.uri)
    );
  }, [selectedAssets]);

  return (
    <View key={album?.id} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          width: Dimensions.get("screen").width,
          // height: Dimensions.get("screen").height / 3
        }}
      >
        <MasonryFlashList
          automaticallyAdjustContentInsets
          data={assets}
          extraData={selectedAssets}
          numColumns={3}
          onEndReached={loadMore}
          estimatedItemSize={128}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingLeft: 1,
            paddingRight: 1,
            paddingTop: headerHeight,
            paddingBottom: Dimensions.get("screen").width / 4.8 + 48,
          }}
          renderItem={({ item, index }) => {
            return (
              <Pressable
                onPress={() => toggleAsset(item)}
                onLongPress={() => console.log("Long press")}
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  },
                ]}
              >
                <Image
                  recyclingKey={item?.uri}
                  source={{ uri: item?.uri }}
                  priority="high"
                  style={{
                    marginRight: 1,
                    width: Dimensions.get("screen").width / 3 - 1.5,
                    height: Dimensions.get("screen").width / 3 - 1.5,
                  }}
                />
              </Pressable>
            );
          }}
        />
      </View>
      {selectedAssets?.length > 0 && (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={{
            position: "absolute",
            bottom: 24,
            shadowColor: "rgba(0,0,0,0.24)",
            shadowRadius: 12,
            shadowOpacity: 0.88,
            left: 24,
            borderRadius: 8,
            overflow: "hidden",
            right: 24,
          }}
        >
          <BlurView style={{ borderRadius: 8 }}>
            <FlatList
              horizontal
              data={selectedAssets}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 12,
                paddingVertical: 12,
                paddingHorizontal: 12,
              }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <Image
                    recyclingKey={item?.uri}
                    source={{ uri: item?.uri }}
                    style={{
                      borderRadius: 4,
                      width: Dimensions.get("screen").width / 5.6,
                      height: Dimensions.get("screen").width / 5.6,
                    }}
                  />
                );
              }}
            />
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
}
