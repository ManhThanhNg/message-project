import React, { useEffect, useContext } from "react";
import { View, Image, StyleSheet, Text, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";

const UserProfile = ({ route }) => {
  const userInfo = route.params;
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: userInfo.name,
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <Text style={{ fontSize: 23, fontWeight: "bold", color: "white" }}>
            Logout
          </Text>
          <Feather
            onPress={() => {
              AsyncStorage.removeItem("authToken");
              setUserId("");
              navigation.navigate("Login");
            }}
            name="log-out"
            size={24}
            color="white"
          />
        </View>
      ),
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.headerImage} source={{ uri: userInfo.image }} />
        <Text style={styles.headerText}>{userInfo.name}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.email}>{userInfo.email}</Text>
        {/* Add more user details here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: "#4CAF50", // Green color, use your preferred color
  },
  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  headerText: {
    marginTop: 8,
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    padding: 16,
  },
  email: {
    fontSize: 18,
    color: "#333",
    marginBottom: 16,
  },
});

export default UserProfile;
