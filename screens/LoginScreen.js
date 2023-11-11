import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HOST } from "../config";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [isShowPassword, setIsShowPassword] = useState(true);

  useEffect(() => {
      const checkLoginStatus = async () => {
          try {
              const token = await AsyncStorage.getItem("authToken");
              if (token) {
                  navigation.navigate("HomeScreen");
              } else {
                  // token not found, show the login screen
              }
          } catch (error) {
              console.log("error:", error);
          }
      };
      checkLoginStatus();
  }, [])
  const handleLogin = async () => {
    const user = {
      email: email,
      password: password,
    };
    try {
      const response = await fetch(HOST + "/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      console.log("res status: " + response.status);
      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        navigation.navigate("HomeScreen");
      } else if (response.status === 401 || response.status === 404) {
        Alert.alert(
          "Lỗi đăng nhập",
          "Thông tin đăng nhập không chính xác. Vui lòng thử lại"
        );
      } else {
        Alert.alert(
          "Lỗi đăng nhập",
          "Có lỗi xảy ra do thằng Thanh. Liên hệ nó."
        );
      }
    } catch (error) {
      console.log("Login: " + error);
    }

    // axios.post(HOST + "/login", user)
    //     .then((response) => {
    //       console.log(response.status);
    //     if (response.status(200)) {
    //       const token = response.data.token;
    //       AsyncStorage.setItem("authToken", token);
    //       navigation.navigate("HomeScreen");
    //     }else if(response.status(401) || response.status(404)){
    //       Alert.alert("Lỗi đăng nhập", "Thông tin đăng nhập không chính xác. Vui lòng thử lại");
    //     }
    // }).catch((error) => {
    //     console.log(error);
    //     Alert.alert("Lỗi đăng nhập", "Có lỗi xảy ra do hệ thống. Liên hệ admin để được hỗ trợ");
    // })
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset="80">
        <View style={{ marginTop: 100, alignItems: "center" }}>
          <Text style={{ color: "#4A55A2", fontSize: 17, fontWeight: "600" }}>
            Sign In
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 15 }}>
            Sign In to Your Account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View>
            <Text>Email</Text>
            <TextInput
              value={email}
              keyboardType="email-address"
              onChangeText={(text) => {
                setEmail(text);
              }}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"gray"}
              placeholder="Enter your email"
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text>Password</Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={isShowPassword}
              style={{
                fontSize: password ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"gray"}
              placeholder="Enter your password"
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 0, bottom: 10 }}
            >
              {!isShowPassword ? 
              <Ionicons
                name="eye-off"
                size={24}
                color="black"
                onPress={() => setIsShowPassword(!isShowPassword)}
              /> : 
              <Ionicons
                name="eye"
                size={24}
                color="black"
                onPress={() => setIsShowPassword(!isShowPassword)}
              />}
            </TouchableOpacity>
          </View>
          <Pressable>
            <Text
              style={{
                color: "#4A55A2",
                fontSize: 17,
                fontWeight: "600",
                marginTop: 10,
              }}
            >
              Forgot Password?
            </Text>
          </Pressable>
          <Pressable
            onPress={handleLogin}
            style={{
              width: 200,
              backgroundColor: "#4A55A2",
              padding: 15,
              marginTop: 50,
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Login
            </Text>
          </Pressable>
          <Pressable
            style={{ marginTop: 15 }}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
