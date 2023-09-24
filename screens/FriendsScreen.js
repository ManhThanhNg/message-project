import React, {useContext, useEffect, useState} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {UserType} from "../UserContext";
import axios from "axios";
import FriendsRequest from "../components/FriendsRequest";
import {HOST} from "../config";

const FriendsScreen = () => {
    const {userId, setUserId} = useContext(UserType);
    const [friendRequests, setFriendRequests] = useState([]);
    const fetchFriendRequest = async () => {
        try {
            const response = await axios.get(HOST +`/friend-request/${userId}`)
            if (response.status===200){
                const friendRequestsData = response.data.friendRequests.map((friendRequest)=>({
                    _id: friendRequest._id,
                    name: friendRequest.name,
                    email: friendRequest.email,
                    image: friendRequest.image
                }));
                setFriendRequests(friendRequestsData)
            }
        } catch (error) {
            console.log("FriendScreen error fetching friend request", error)
        }
    }
    useEffect(() => {
        fetchFriendRequest();
    }, [])
    // console.log("friendRequests:", friendRequests)
    return (
        <View style={{padding:10, marginHorizontal:12}}>
            {friendRequests.length>0 && <Text>Your Friend Requests !</Text>}
            {friendRequests.map((item, index) => (
                <FriendsRequest
                    key={index}
                    item={item}
                    friendRequests={friendRequests}
                    setFriendRequests={setFriendRequests}
                />
            ))}
        </View>
    )
}

export default FriendsScreen

const styles = StyleSheet.create({})