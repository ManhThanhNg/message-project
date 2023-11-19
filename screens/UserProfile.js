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
          <Text style={{ fontSize: 20, color: "white" }}>
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
        <Text style={styles.headerText}> User Name: {userInfo.name}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.email}>Email: {userInfo.email}</Text>
        <Text style={styles.email}>Phone: {userInfo.phone}</Text>
        {/* Add more user details here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Light gray background
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#3498db', // Blue color for the header
  },
  headerImage: {
    width: '100%',
    aspectRatio: 1, // This ensures that the image maintains its aspect ratio (1:1 for a circle)
    borderRadius: 999, // A large value to create a circle
    borderWidth: 4,
    borderColor: '#fff',
  },
  headerText: {
    marginTop: 16,
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    padding: 16,
  },
  email: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },
});

export default UserProfile;
