import React, {useContext, useEffect, useState} from 'react'
import {Pressable, ScrollView, StyleSheet} from 'react-native'
import {UserType} from "../UserContext";
import {useNavigation} from "@react-navigation/native";
import {HOST} from "../config";
import UserChat from "../components/UserChat";

const ChatsScreen = () => {
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const {userId, setUserId} = useContext(UserType);
    const navigation = useNavigation();
    useEffect(() => {
        const acceptedFriendList = async () => {
            try {
                const response = await fetch(HOST + `/accepted-friends/${userId}`)
                const data = await response.json();
                if (response.ok) {
                    setAcceptedFriends(data)
                }
            } catch (error) {
                console.log("Chat Screen - error getting accepted friend list: ", error)
            }
        };
        acceptedFriendList();
    }, [])

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable>
                {acceptedFriends.map((item, index) => (
                    <UserChat key = {index} item = {item}/>
                ))}
            </Pressable>
        </ScrollView>
    )
}

export default ChatsScreen

const styles = StyleSheet.create({})