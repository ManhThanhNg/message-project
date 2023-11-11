import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { HOST } from "../config";
import * as ImagePicker from "expo-image-picker";
import io from "socket.io-client";

const MessageScreen = ({ navigation, route }) => {
  const socket = io(HOST, { transports: ["websocket"] });
  const [messages, setMessages] = useState([]); //all the messages
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState([]); //the selected message
  const [messageInput, setMessageInput] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const { recipientId } = route.params;
  const [selectedImage, setSelectedImage] = useState("");
  const [recipientData, setRecipientData] = useState({});

  const scrollViewRef = useRef(null);

  function scrollToBottom() {
    if (scrollViewRef.current)
      scrollViewRef.current.scrollToEnd({ animated: false });
  }

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleContentSizeChange = () => {
    scrollToBottom();
  };

  function handleEmojiPicker() {
    setShowEmojiPicker(!showEmojiPicker);
  }

  const handleFetchMessages = async () => {
    try {
      const response = await fetch(HOST + `/messages/${userId}/${recipientId}`);
      const data = await response.json();
      if (response.ok) {
        if (data.messages !== messages) setMessages(data.messages);
      } else {
        console.log("Error with message", response.status);
      }
    } catch (error) {
      console.log("Error fetching messages: " + error);
    }
  };

  useEffect(() => {
    handleFetchMessages();
    socket.on(`${userId}`, (data) => {
      handleFetchMessages();
    });
  }, []);
  useEffect(() => {
    //get the recipient data
    const fetchRecipient = async () => {
      try {
        const response = await fetch(HOST + `/user/${recipientId}`);
        const data = await response.json();
        setRecipientData(data);
      } catch (error) {
        console.log("Error getting the recipient: " + error);
      }
    };
    fetchRecipient();
  }, []);
  const handleSend = async (messageType, imageUri, messageText) => {
    //handle sending the message
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
        formData.append("messageText", messageText);
      }
      setMessageInput("");
      setSelectedImage("");
      const newMessage = {
        __v: 0,
        _id: "tempId",
        imageURL: imageUri ? imageUri : null,
        messageText: messageText ? messageText : null,
        messageType: messageType,
        recipientId: recipientId,
        senderId: {
          _id: userId,
          name: "tempName",
        },
        timeStamps: new Date().getTime(),
      };
      setMessages([...messages, newMessage]);
      const response = await fetch(HOST + "/message", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        socket.emit("messageTo", {
          recipientId: recipientId,
          message: messageInput,
        });
      }
    } catch (error) {
      console.log("Error sending the message: " + error);
    }
  };

  const deleteMessage = async (selectedMessage) => {
    try {
      const response = await fetch(HOST + "/delete-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId: selectedMessage }),
      });
      if (response.ok) {
        setSelectedMessage([]);
        handleFetchMessages();
      } else {
        console.log("Invalid delete request", response.status);
      }
    } catch (error) {
      console.log("Error deleting the message: " + error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => {
              navigation.goBack();
            }}
            name="arrow-back"
            size={24}
            color="black"
          />
          {selectedMessage.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {selectedMessage.length}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}
                source={{ uri: recipientData.image }}
              />
              <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                {recipientData?.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessage.length > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
            <Ionicons name="md-arrow-undo" size={24} color="black" />
            <FontAwesome name="star" size={24} color="black" />
            <AntDesign
              onPress={() => deleteMessage(selectedMessage)}
              name="delete"
              size={24}
              color="black"
            />
          </View>
        ) : null,
    });
  }, [recipientData, selectedMessage]);
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      handleSend("image", result.assets[0].uri);
    }
  };

  const handleSelectMessage = (message) => {
    const isSelected = selectedMessage.includes(message._id);
    if (isSelected) {
      setSelectedMessage((prevSelectedMessage) =>
        prevSelectedMessage.filter((id) => id !== message._id)
      );
    } else
      setSelectedMessage((prevSelectedMessage) => [
        ...prevSelectedMessage,
        message._id,
      ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F0F0F0" }}
      behavior="padding"
      keyboardVerticalOffset="80"
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.map((item, index) => {
          const isSelected = selectedMessage.includes(item._id);
          if (item.messageType === "text") {
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
                key={index}
                style={[
                  item?.senderId._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                  isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: isSelected ? "right" : "left",
                  }}
                >
                  {item?.messageText}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item.timeStamps)}
                </Text>
              </Pressable>
            );
          }
          if (item.messageType === "image") {
            const baseUrl = HOST + "/image/";
            const imageUrl = item.imageURL;
            const filename = imageUrl.split("\\").pop();
            const imagePath = { uri: baseUrl + filename };
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
                onPress={() => {
                  navigation.navigate("ImageViewer", { imageUrl: imagePath });
                }}
                key={index}
                style={[
                  item?.senderId._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                  isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                ]}
              >
                <Image
                  source={imagePath}
                  style={{ width: 200, height: 200, borderRadius: 7 }}
                />
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    marginTop: 5,
                    position: "absolute",
                    color: "white",
                    right: 10,
                    bottom: 8,
                  }}
                >
                  {formatTime(item.timeStamps)}
                </Text>
              </Pressable>
            );
          }
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiPicker ? 0 : 25,
        }}
      >
        {/*    Input Message*/}
        <Entypo
          onPress={() => {
            handleEmojiPicker();
          }}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="black"
        />
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
            setMessageInput(text);
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo
            onPress={() => {
              pickImage();
            }}
            name="camera"
            size={24}
            color="gray"
          />
          <Feather name="mic" size={24} color="gray" />
        </View>
        <Pressable
          onPress={() => {
            if (messageInput) {
              handleSend("text", "", messageInput);
            }
          }}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>
      {showEmojiPicker && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessageInput((prevMessage) => prevMessage + emoji);
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({});
