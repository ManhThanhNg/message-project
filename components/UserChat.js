import React, {useContext, useEffect, useState} from 'react'
import {Image, Pressable, StyleSheet, Text, View} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import {HOST} from "../config";
import {UserType} from "../UserContext";

const UserChat = ({item}) => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const {userId, setUserId} = useContext(UserType);
    const handleFetchMessages = async () => {
        try {
            const response = await fetch(HOST + `/messages/${userId}/${item._id}`);
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
    },[])

    const getLastMessage = () => {
        const userMessages = messages.filter((message) => message.messageType === "text");
        return userMessages[userMessages.length - 1];
    };
    const lastMessage = getLastMessage();
    const formatTime = (time) => {
        const options = {hour: "numeric", minute: "numeric"};
        return new Date(time).toLocaleString("en-US", options);
    }

    return (
        <Pressable
            onPress={() => navigation.navigate("Message", {
                recipientId: item._id,
                name: item.name,
                image: HOST + "/image/" + item.image.split("\\").pop()
            })}
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderWidth: 0.7,
                borderColor: "#D0D0D0",
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                padding: 10,
            }}>
            <Image
                style={{width: 50, height: 50, borderRadius: 25, resizeMode: "cover"}}
                source={{uri: item? HOST + "/image/" + item.image.split("\\").pop():null}}/>
            <View style={{flex: 1}}>
                <Text style={{fontSize: 15, fontWeight: "500"}}>{item?.name}</Text>
                {lastMessage && (
                    <Text style={{marginTop: 3, color: "gray", fontWeight: "500"}}>{lastMessage?.messageText}</Text>
                )}
            </View>
            <View>
                <Text style={{fontSize: 11, fontWeight: "400", color: "#585858"}}>
                    {lastMessage && formatTime(lastMessage?.timeStamps)}
                </Text>
            </View>
        </Pressable>

    )
}

export default UserChat

const styles = StyleSheet.create({})