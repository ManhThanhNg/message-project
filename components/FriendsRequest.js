import React, {useContext} from 'react'
import {Image, Pressable, StyleSheet, Text} from 'react-native'
import {UserType} from "../UserContext";
import {useNavigation} from "@react-navigation/native";
import {HOST} from "../config";

const FriendsRequest = ({item, friendRequests, setFriendRequests}) => {
    const {userId, setUserId} = useContext(UserType);
    const navigation = useNavigation();
    const acceptRequest = async (friendRequestId) => {
        try{
            const response = await fetch(HOST+"/friend-request/accept", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"

                },
                body: JSON.stringify({
                    senderId: friendRequestId,
                    recipientId: userId,
                })
            })
            if (response.ok){
                setFriendRequests(friendRequests.filter(
                    (request)=> request._id !== friendRequestId
                ));
                navigation.navigate("Chats");
            }
        } catch (error) {
            console.log("error accepting friend request", error);
        }
    }

    return (
        <Pressable
            style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
            <Image
                source={{uri: HOST + "/image/" + item.image.split("\\").pop()}}
                style={{width: 50, height: 50, borderRadius: 25}}
            />
            <Text
                style={{fontSize:15, fontWeight:"bold", marginLeft:10, flex:1}}
            >{item?.name} sent you a friend request</Text>
            <Pressable style={{backgroundColor: "#0066b2", padding: 10, borderRadius: 6}}>
                <Text
                    onPress={()=>acceptRequest(item._id)}
                    style={{textAlign: "center", color: "white"}}>
                    Accept</Text>
            </Pressable>
        </Pressable>
    )
}

export default FriendsRequest

const styles = StyleSheet.create({})