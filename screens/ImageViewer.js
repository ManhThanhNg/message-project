import React from "react";
import { View, Image, StyleSheet } from "react-native";


const ImageViewer = ({ route }) => {
  const { imageUrl } = route.params;
  return (
    <View style={styles.container}>
      <Image source={imageUrl} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default ImageViewer;
