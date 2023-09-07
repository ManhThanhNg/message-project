import {KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View} from 'react-native'
import React, {useState} from 'react'
import {useNavigation} from "@react-navigation/native";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    return (<View style={{flex: 1, backgroundColor: 'white', padding: 10, alignItems: "center"}}>
            <KeyboardAvoidingView>
                <View style={{marginTop: 100, alignItems: "center"}}>
                    <Text style={{color: '#4A55A2', fontSize: 17, fontWeight: "600"}}>Sign In</Text>
                    <Text style={{fontSize: 17, fontWeight: "600", marginTop: 15}}>Sign In to Your Account</Text>
                </View>

                <View style={{marginTop: 50}}>
                    <View>
                        <Text>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            style={{
                                fontSize: email ? 18 : 18,
                                borderBottomColor: "gray",
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300
                            }}
                            placeholderTextColor={"gray"}
                            placeholder="Enter your email"/>
                    </View>
                    <View style={{marginTop: 10}}>
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
                                width: 300
                            }}
                            placeholderTextColor={"gray"}
                            placeholder="Enter your password"/>
                    </View>
                    <Pressable>
                        <Text style={{color: '#4A55A2', fontSize: 17, fontWeight: "600", marginTop: 10}}>Forgot
                            Password?</Text>
                    </Pressable>
                    <Pressable style={{
                        width: 200,
                        backgroundColor: "#4A55A2",
                        padding: 15,
                        marginTop: 50,
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: 6
                    }}>
                        <Text style={{color: "white", fontWeight: "bold", textAlign: "center"}}>Login</Text>
                    </Pressable>
                    <Pressable
                        style={{marginTop: 15}}
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={{textAlign: "center", color: 'gray', fontSize: 16}}>Don't have an account? Sign
                            Up</Text>
                    </Pressable>

                </View>
            </KeyboardAvoidingView>
        </View>


    )
}

export default LoginScreen

const styles = StyleSheet.create({})