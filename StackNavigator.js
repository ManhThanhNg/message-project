import {StyleSheet} from 'react-native'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import FriendsScreen from "./screens/FriendsScreen";
import ChatsScreen from "./screens/ChatsScreen";
import MessageScreen from "./screens/MessageScreen";
import ImageViewer from './screens/ImageViewer';
import UserProfile from './screens/UserProfile';


const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
    const globalScreenOptions = {
        headerStyle: { backgroundColor: "#002146" },
        headerTitleStyle: { color: "white" },
        headerTintColor: "white",
      };
      
    return (
        <NavigationContainer >
            <Stack.Navigator screenOptions={globalScreenOptions}>
                <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: true}}/>
                <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: true}}/>
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerBackButtonMenuEnabled:false}} />
                <Stack.Screen name="Friends" component={FriendsScreen} options={{headerShown: true, title: "Friend Request"}}/>
                <Stack.Screen name="Chats" component={ChatsScreen}/>
                <Stack.Screen name="Message" component={MessageScreen}/>
                <Stack.Screen name="ImageViewer" component={ImageViewer} options={{headerShown: true, title: "Images"}}/>
                <Stack.Screen name = "UserProfile" component = {UserProfile} options = {{headerShown: true, title: "UserProfile"}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNavigator

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "Green",
        alignItems: "center",
        justifyContent: "center",
    },
})
