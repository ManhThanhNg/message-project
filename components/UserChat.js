import React from 'react'
import {Image, Pressable, StyleSheet, Text, View} from 'react-native'
import {useNavigation} from "@react-navigation/native";

const UserChat = ({item}) => {
    const navigation = useNavigation();

    return (
        <Pressable
            onPress={() => navigation.navigate("Message", {
                recipientId: item._id,
                recipientName: item.name,
                recipientImage: item.image
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
                source={{uri: item?.image}}/>
            <View style={{flex: 1}}>
                <Text style={{fontSize: 15, fontWeight: "500"}}>{item?.name}</Text>
                <Text style={{marginTop: 3, color: "gray", fontWeight: "500"}}>Last Message</Text>
            </View>
            <View>
                <Text style={{fontSize: 11, fontWeight: "400", color: "#585858"}}>3:00 PM</Text>
            </View>
        </Pressable>

    )
}

export default UserChat

const styles = StyleSheet.create({})