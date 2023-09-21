import React, {useContext, useState} from 'react'
import {Image, Pressable, Text, View, StyleSheet} from 'react-native'
import {UserType} from "../UserContext";

const User = ({item}) => {
    const {userId, setUserId} = useContext(UserType);
    const [requestSent, setRequestSent] = useState(false);

    const sendFriendRequestTo = async (currentUserId, selectedUserId) => {
        try {
            const response = await fetch("http://192.168.1.6:8000/friend-request", {
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
            <Pressable
                onPress={() => {
                    sendFriendRequestTo(userId, item._id)
                }}
                style={{backgroundColor: "#567189", padding: 10, borderRadius: 6, width: 105}}>
                <Text style={{textAlign: "center", color: "white", fontSize: 13}}>Add Friend</Text>
            </Pressable>
        </Pressable>
    )
}
export default User

const styles = StyleSheet.create({})