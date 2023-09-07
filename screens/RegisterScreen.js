import {KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View} from 'react-native'
import React, {useState} from 'react'
import {useNavigation} from "@react-navigation/native";

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [image, setImage] = useState("");
    const navigation = useNavigation();
    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 10,
            alignItems: "center"
        }}>
            <KeyboardAvoidingView>
                <View style={{marginTop: 100, alignItems: "center"}}>
                    <Text style={{color: '#4A55A2', fontSize: 17, fontWeight: "600"}}>Register</Text>
                    <Text style={{fontSize: 17, fontWeight: "600", marginTop: 15}}>Register an Account</Text>
                </View>

                <View style={{marginTop: 50}}>
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
                                width: 300
                            }}
                            placeholderTextColor={"gray"}
                            placeholder="Enter your name"/>
                    </View>
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
                    <View style={{marginTop: 10}}>
                        <Text>Image</Text>
                        <TextInput
                            value={image}
                            onChangeText={(text) => setImage(text)}
                            style={{
                                fontSize: image ? 18 : 18,
                                borderBottomColor: "gray",
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300
                            }}
                            placeholderTextColor={"gray"}
                            placeholder="Image"/>
                    </View>

                    <Pressable style={{
                        width: 200,
                        backgroundColor: "#4A55A2",
                        padding: 15,
                        marginTop: 50,
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: 6
                    }}>
                        <Text style={{color: "white", fontWeight: "bold", textAlign: "center"}}>Register</Text>
                    </Pressable>
                    <Pressable
                        style={{marginTop: 15}}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={{textAlign: "center", color: 'gray', fontSize: 16}}>Already have an account? Sign
                            In</Text>
                    </Pressable>

                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({})