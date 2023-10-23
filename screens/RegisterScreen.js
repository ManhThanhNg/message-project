import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { HOST } from "../config";
import { Ionicons } from "@expo/vector-icons";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [image, setImage] = useState("");
  const navigation = useNavigation();
  const [isShowPassword, setIsShowPassword] = useState(true);

  const handleRegister = () => {
    const user = {
      name: fullName,
      email: email,
      password: password,
      image: image,
    };

    axios
      .post(HOST + "/register", user)
      .then((response) => {
        console.log(response.data);
        Alert.alert(
          "Registration Successful",
          "You have registered successfully"
        );
        setFullName("");
        setEmail("");
        setPassword("");
        setImage("");
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(
          "Registration Error",
          "An error occurred while registering. Please try again later."
        );
      });
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
            Register
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 15 }}>
            Register an Account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View>
            <Text>Name</Text>
            <TextInput
              value={fullName}
              onChangeText={(text) => setFullName(text)}
              style={{
                fontSize: fullName ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"gray"}
              placeholder="Enter your name"
            />
          </View>
          <View>
            <Text>Email</Text>
            <TextInput
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
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
              secureTextEntry={true}
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
          <View style={{ marginTop: 10 }}>
            <Text>Image</Text>
            <TextInput
              value={image}
              onChangeText={(text) => setImage(text)}
              style={{
                fontSize: image ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"gray"}
              placeholder="Image"
            />
          </View>

          <Pressable
            onPress={handleRegister}
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
              Register
            </Text>
          </Pressable>
          <Pressable
            style={{ marginTop: 15 }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Already have an account? Sign In
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
