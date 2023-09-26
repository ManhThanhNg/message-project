import React, {useState} from 'react'
import {KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native'
import {Entypo, Feather} from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";

const MessageScreen = () => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState("");

    function handleEmojiPicker() {
        setShowEmojiPicker(!showEmojiPicker);
    }

    return (<KeyboardAvoidingView
        style={{flex: 1, backgroundColor: "#F0F0F0"}}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <ScrollView>
            {/*    All the chat message go over here*/}
        </ScrollView>
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: "#dddddd",
            marginBottom: showEmojiPicker ? 0:25
        }}>
            {/*    Input Message*/}
            <Entypo
                onPress={() => {
                    handleEmojiPicker()
                }}
                style={{marginRight: 5}} name="emoji-happy" size={24} color="black"/>
            <TextInput
                style={{
                    flex: 1,
                    height: 40,
                    borderWidth: 1,
                    borderColor: "#dddddd",
                    borderRadius: 20,
                    paddingHorizontal: 10,
                }}
                placeholder={"Text Message"}
                value={message}
                onChangeText={(text) => {
                    setMessage(text)
                }}
            />
            <View style={{flexDirection: "row", alignItems: "center", gap: 7, marginHorizontal: 8}}>
                <Entypo name="camera" size={24} color="gray"/>
                <Feather name="mic" size={24} color="gray"/>
            </View>
            <Pressable style={{
                backgroundColor: "#007bff",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 20,
            }}>
                <Text style={{color: "white", fontWeight: "bold"}}>Send</Text>
            </Pressable>
        </View>
        {showEmojiPicker && (
            <EmojiSelector
                onEmojiSelected={(emoji) => {
                    setMessage(prevMessage => prevMessage + emoji)
                }}
                style={{height: 250}}/>)}
    </KeyboardAvoidingView>)
}

export default MessageScreen

const styles = StyleSheet.create({})