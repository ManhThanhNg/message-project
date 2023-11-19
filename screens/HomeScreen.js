//reactNativeFunctionalExportComponentWithStyle
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import User from "../components/User";
import { HOST } from "../config";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions(
      {
        headerTitle: "",
        headerLeft: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <Pressable
              onPress={() => navigation.navigate("UserProfile", userInfo)}
            >
              <Image
                source={{
                  uri: userInfo.image,
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginLeft: -5,
                  resizeMode: "cover",
                }}
              />
            </Pressable>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
              MCC - Muggle Magic Chat
            </Text>
          </View>
        ),
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <Ionicons
              onPress={() => navigation.navigate("Chats")}
              name="chatbox-ellipses-outline"
              size={24}
              color="white"
            />
            <Ionicons
              onPress={() => navigation.navigate("Friends")}
              name="people-outline"
              size={24}
              color="white"
            />
          </View>
        ),
      },
      []
    );
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.payload.userId;
      setUserId(userId);

      axios
        .get(HOST + `/users/${userId}`)
        .then((response) => {
          setUsers(response.data.users);
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
      axios
        .get(HOST + `/user/${userId}`)
        .then((response) => {
          setUserInfo({
            name: response.data.name,
            image: HOST + "/image/" + response.data.image.split("\\").pop(),
            email: response.data.email,
          });
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };
    fetchUsers();
  }, []);
  // console.log("users", users);
  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}    
      >
      {users.map((item, index) => (
        <User key={index} item={item} />
      ))}
    </ScrollView>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({});
