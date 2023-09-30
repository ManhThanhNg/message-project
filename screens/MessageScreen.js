import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native'
import {Entypo, Feather, Ionicons} from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import {UserType} from "../UserContext";
import {HOST} from "../config";

const MessageScreen = ({navigation, route}) => {
    const [messages, setMessages] = useState([]); //all the messages
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messageInput, setMessageInput] = useState("");
    const {userId, setUserId} = useContext(UserType);
    const {recipientId} = route.params;
    const [selectedImage, setSelectedImage] = useState("");
    const [recipientData, setRecipientData] = useState({});

    function handleEmojiPicker() {
        setShowEmojiPicker(!showEmojiPicker);
    }

    const handleFetchMessages = async () => {
        try {
            const response = await fetch(HOST + `/messages/${userId}/${recipientId}`);
            const data = await response.json();
            if (response.ok) {
                setMessages(data.messages);
            } else {
                console.log("Error with message", response.status)
            }
        } catch (error) {
            console.log("Error fetching messages: " + error);
        }
    }
    useEffect(() => {
        handleFetchMessages();
    }, [])
    useEffect(() => { //get the recipient data
        const fetchRecipient = async () => {
            try {
                const response = await fetch(HOST + `/user/${recipientId}`);
                const data = await response.json();
                setRecipientData(data);
            } catch (error) {
                console.log("Error getting the recipient: " + error)
            }
        }
        fetchRecipient();
    }, [])
    const handleSend = async (messageType, imageUri) => { //handle sending the message
        try {
            const formData = new FormData();
            formData.append("senderId", userId);
            formData.append("recipientId", recipientId);

            //if the message type is image or a noormal text
            if (messageType === "image") {
                formData.append("messageType", "image");
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpeg",
                });
            } else {
                formData.append("messageType", "text");
                formData.append("messageText", messageInput);
            }
            const response = await fetch(HOST + "/message", {
                method: "POST",
                body: formData,

            })
            if (response.ok) {
                setMessageInput("");
                setSelectedImage("");
            }
        } catch (error) {
            console.log("Error sending the message: " + error);
        }
    }
    console.log("messages:", messages)
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                    <Ionicons
                        onPress={() => {
                            navigation.goBack();
                        }}
                        name="arrow-back" size={24} color="black"/>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Image
                            style={{width: 30, height: 30, borderRadius: 15, resizeMode: "cover"}}
                            source={{uri: recipientData.image}}/>
                        <Text style={{marginLeft: 5, fontSize: 15, fontWeight: "bold"}}>{recipientData.name}</Text>
                    </View>
                </View>
            )
        })
    }, [recipientData])
    const formatTime = (time) => {
        const options = {hour: "numeric", minute: "numeric"};
        return new Date(time).toLocaleString("en-US",options);
    }
    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: "#F0F0F0"}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView>
                {messages.map((item, index) => {
                        if (item.messageType === 'text') {
                            return (
                                <Pressable
                                    key={index}
                                    style={[
                                        item?.senderId._id === userId ?
                                            {
                                                alignSelf: "flex-end",
                                                backgroundColor: "#DCF8C6",
                                                padding: 8,
                                                maxWidth: "60%",
                                                borderRadius: 7
                                            } :
                                            {
                                                alignSelf: "flex-start",
                                                backgroundColor: "white",
                                                padding: 8,
                                                margin: 10,
                                                borderRadius: 7,
                                                maxWidth: "60%"
                                            }
                                    ]}>
                                    <Text style={{fontSize: 13}}>{item?.messageText}</Text>
                                    <Text style={{textAlign:"center"}}>{formatTime(item.timeStamps)}</Text>
                                </Pressable>
                            )
                        }
                    }
                )
                }
            </ScrollView>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderTopWidth: 1,
                borderTopColor: "#dddddd",
                marginBottom: showEmojiPicker ? 0 : 25
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
                    value={messageInput}
                    onChangeText={(text) => {
                        setMessageInput(text)
                    }}
                />
                <View style={{flexDirection: "row", alignItems: "center", gap: 7, marginHorizontal: 8}}>
                    <Entypo name="camera" size={24} color="gray"/>
                    <Feather name="mic" size={24} color="gray"/>
                </View>
                <Pressable
                    onPress={() => handleSend("text")}
                    style={{
                        backgroundColor: "#007bff", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20,
                    }}>
                    <Text style={{color: "white", fontWeight: "bold"}}>Send</Text>
                </Pressable>
            </View>
            {showEmojiPicker && (<EmojiSelector
                onEmojiSelected={(emoji) => {
                    setMessageInput(prevMessage => prevMessage + emoji)
                }}
                style={{height: 250}}/>)}
        </KeyboardAvoidingView>)
}

export default MessageScreen

const styles = StyleSheet.create({})