import { View, FlatList, Text as RNText, Pressable } from "react-native";
import React from "react";
import { NativeStackNavigationHelpers } from "react-native-screens/lib/typescript/native-stack/types";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Button, Dimensions, Image as RNIMage } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  BackdropFilter,
  BlendColor,
  Box,
  Canvas,
  ColorMatrix,
  CornerPathEffect,
  DisplacementMap,
  Fill,
  Image,
  Lerp,
  LinearToSRGBGamma,
  Mask,
  SkImage,
  Skia,
  Turbulence,
  rect,
  rrect,
  useImage,
  Text,
} from "@shopify/react-native-skia";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

const Images = ({
  navigation,
  route,
}: {
  route;
  any;
  navigation: NativeStackNavigationHelpers;
}) => {
  const { images } = route.params;
  const [skiaImages, setSkiaImages] = useState<SkImage | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<number>(0);

  //   console.log("IMAGE 0:", images?.[0]);
  const headerHeight = useHeaderHeight();

  const readImages = async (base64: any) => {
    const data = Skia.Data.fromBase64(base64);
    const image = Skia.Image.MakeImageFromEncoded(data);

    setSkiaImages(image);

    // console.log("🚀 ~ readImages ~ imageData:", image);
  };

  const SEPIUM = [
    1.3, -0.3, 1.1, 0, 0, 0, 1.3, 0.2, 0, 0, 0, 0, 0.8, 0.2, 0, 0, 0, 0, 1, 0,
  ];

  const OLD_TIMES = [
    1, 0, 0, 0, 0, -0.4, 1.3, -0.4, 0.2, -0.1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
  ];
  const BLACK_AND_WHITE = [
    0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
  ];

  const blackAndWhite = [
    0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
  ];
  const purple = [
    1, -0.2, 0, 0, 0, 0, 1, 0, -0.1, 0, 0, 1.2, 1, 0.1, 0, 0, 0, 1.7, 1, 0,
  ];

  const Filters = [
    { title: "Normal", filter: <></> },
    {
      title: "Purple",
      filter: (
        <Lerp t={0.5}>
          <ColorMatrix matrix={purple} />
          <ColorMatrix matrix={blackAndWhite} />
        </Lerp>
      ),
    },
    {
      title: "Light blue",
      filter: (
        <LinearToSRGBGamma>
          <BlendColor color="lightblue" mode="multiply" />
        </LinearToSRGBGamma>
      ),
    },
    {
      title: "Displacement",
      filter: (
        <DisplacementMap channelX="g" channelY="r" scale={10}>
          <Turbulence freqX={0.01} freqY={0.05} octaves={2} seed={8} />
        </DisplacementMap>
      ),
    },
    {
      title: "Black & white",
      filter: <ColorMatrix matrix={BLACK_AND_WHITE} />,
    },
    { title: "Sepium", filter: <ColorMatrix matrix={SEPIUM} /> },
    { title: "Old times", filter: <ColorMatrix matrix={OLD_TIMES} /> },
  ];

  const makeImg = async (img: MediaLibrary.Asset) => {
    // console.log("IMAGE:", img);

    const res = await MediaLibrary.getAssetInfoAsync(img.id);
    // console.log("🚀 ~ makeImg ~ res:", res);

    const base64 = await FileSystem.readAsStringAsync(`${res.localUri}`, {
      encoding: "base64",
    });
    if (base64) {
      //   console.log("BASE64:", base64);
      readImages(base64);
    }
  };

  React.useEffect(() => {
    if (images?.[0]) {
      //   readImages(images?.[0]);
      makeImg(images?.[0]);
    }
  }, [images]);

  return (
    <View style={{ flex: 1, paddingTop: headerHeight }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderRadius: 12,
        }}
      >
        <Canvas
          style={{
            flex: 1,

            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Image
            image={skiaImages}
            fit={"cover"}
            rect={{
              x: 0,
              y: 0,
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").width,
            }}
          >
            {Filters[selectedFilter].filter}
          </Image>
        </Canvas>
      </View>

      <FlatList
        horizontal
        data={Filters}
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 16,
        }}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              onPress={() => {
                console.log("Pressed:::", index);
                setSelectedFilter(index);
              }}
              style={{ gap: 8 }}
            >
              <RNText
                style={{
                  fontSize: 12,
                  fontWeight: selectedFilter === index ? "700" : "normal",
                }}
              >
                {item?.title}
              </RNText>
              <Canvas
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  width: Dimensions.get("screen").width / 4.8,
                  height: Dimensions.get("screen").width / 4.8,
                }}
              >
                <Image
                  image={skiaImages}
                  fit={"cover"}
                  rect={{
                    x: 0,
                    y: 0,
                    width: Dimensions.get("screen").width / 4.8,
                    height: Dimensions.get("screen").width / 4.8,
                  }}
                >
                  {item?.filter}
                </Image>
              </Canvas>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default Images;
