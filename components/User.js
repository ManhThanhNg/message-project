import React, {useContext, useEffect, useState} from 'react'
import {Image, Pressable, StyleSheet, Text, View} from 'react-native'
import {UserType} from "../UserContext";
import {HOST} from "../config";

const User = ({item}) => {
    const {userId, setUserId} = useContext(UserType);
    const [requestSent, setRequestSent] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [userFriends, setUserFriends] = useState([]);
    useEffect(() => {
        const fetchFriendRequest = async () => {
            try {
                const response = await fetch(HOST + `/friend-requests/sent/${userId}`)
                const data = await response.json();
                if (response.ok) {
                    setFriendRequests(data);
                } else console.log("User.js error fetching friend request", error)
            } catch (error) {
                console.log("User.js error fetching friend request", error)
            }
        };
        fetchFriendRequest();
    }, [])
    useEffect(() => {
        const fetchUserFriends = async () => {
            try {
                const response = await fetch(HOST + `/friends/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setUserFriends(data);
                } else
                    console.log("User.js error fetching user friends", error)
            } catch (error) {
                console.log("User.js error fetching user friends", error)
            }
        }
        fetchUserFriends();
    }, [])

    const sendFriendRequestTo = async (currentUserId, selectedUserId) => {
        try {
            const response = await fetch(HOST + "/friend-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({currentUserId, selectedUserId})
            })
            if (response.ok) {
                setRequestSent(true);
            }
        } catch (error) {
            console.log("error sending friend request", error)
        }
    }

    return (
        <Pressable style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10
        }}>
            {/*avatar*/}
            <View>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        resizeMode: "cover"
                    }}
                    source={{uri: item.image}}
                />
            </View>

            {/*name and email*/}
            <View style={{marginLeft: 12, flex: 1}}>
                <Text style={{fontWeight: "bold"}}>{item?.name}</Text>
                <Text style={{marginTop: 4, color: "gray"}}>{item?.email}</Text>
            </View>

            {/*Add Friend button*/}
            {userFriends.includes(item._id)? (
                <Pressable
                    style={{
                        backgroundColor: "#82CD47",
                        padding: 10,
                        width:105,
                        borderRadius: 6,
                    }}
                >
                    <Text style={{textAlign:"center", color: "white"}}>Friends</Text>
                </Pressable>
            ) : requestSent || friendRequests.some((friend)=>friend._id===item._id) ? (
                <Pressable style={{backgroundColor:"gray", padding:10, width: 105, borderRadius: 6}}>
                    <Text style={{textAlign:"center", color: "white"}}>Req. Sent</Text>
                </Pressable>
            ) : (
                <Pressable
                onPress={() => {
                sendFriendRequestTo(userId, item._id)
            }}
                style={{backgroundColor: "#567189", padding: 10, borderRadius: 6, width: 105}}>
                <Text style={{textAlign: "center", color: "white", fontSize: 13}}>Add Friend</Text>
                </Pressable>
                )
            }
        </Pressable>
    )
}
export default User

const styles = StyleSheet.create({})