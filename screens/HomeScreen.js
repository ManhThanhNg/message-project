//reactNativeFunctionalExportComponentWithStyle
import React, {useLayoutEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {Ionicons} from '@expo/vector-icons';

export const HomeScreen = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <Text
                    style={{fontSize:16, fontWeight:"bold"}}
                >Totally Cute Chat</Text>
            ),
            headerRight: () => (
                <View style={{flexDirection:"row",alignItems:"center",gap:8}}>
                    <Ionicons name="chatbox-ellipses-outline" size={24} color="black"/>
                    <Ionicons name="people-outline" size={24} color="black"/>
                </View>

            )
        }, [])
    })
        return (
            <View>
                <Text>HomeScreen</Text>
            </View>
        )
    }
    const styles = StyleSheet.create({})
