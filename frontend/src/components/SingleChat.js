import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import { getSenderFull } from '../config/ChatLogics';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import axios from 'axios';
import "../components/styles.css";
import io from "socket.io-client";
import Lottie from "lottie-react";
import typingAnimation from "../animations/typing.json";
import Send from '@mui/icons-material/Send';
import "../App.css";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const {user,selectedChat,setSelectedChat,notification,setNotification} = ChatState();
    const toast = useToast();
    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const [newMessage,setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing,setTyping] = useState(false);
    const [isTyping,setIsTyping] = useState(false);

    const fetchMessages = async () => {
      if(!selectedChat) return;

      try {
        const config = {
          headers : {
            Authorization:`Bearer ${user.token}`
          }
        }

        setLoading(true)
        const {data} = await axios.get(`/api/message/${selectedChat._id}`,
        config);
        // console.log(messages);
        setMessages(data);
        setLoading(false);
        socket.emit("join chat",selectedChat._id);
      } catch (error) {
        toast({
          title:"Error Occured!",
          description:"Failed to Load the Messages",
          status:"error",
          duration:5000,
          isClosable:true,
          position:"bottom"
        })
      }
    }

    const sendmessageByButton = async() => {
      socket.emit("stop typing",selectedChat._id);
        try {
          const config = {
            headers : {
              "Content-Type" : "application/json",
              Authorization:`Bearer ${user.token}`
            }
          }
          setNewMessage("");
          const {data} = await axios.post('/api/message',{
            content:newMessage,
            chatId:selectedChat._id,
          },
          config
          );
          console.log(data);
          socket.emit("new message", data);
          
          setMessages([...messages,data]);
        } catch (error) {
          toast({
            title:"Error Occured!",
            description:"Failed to send the message",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
          })
        }
    }

    const sendMessage = async(event) => {
      if(event.key === "Enter" && newMessage){
        socket.emit("stop typing",selectedChat._id);
        try {
          const config = {
            headers : {
              "Content-Type" : "application/json",
              Authorization:`Bearer ${user.token}`
            }
          }
          setNewMessage("");
          const {data} = await axios.post('/api/message',{
            content:newMessage,
            chatId:selectedChat._id,
          },
          config
          );
          console.log(data);
          socket.emit("new message", data);
          
          setMessages([...messages,data]);
        } catch (error) {
          toast({
            title:"Error Occured!",
            description:"Failed to send the message",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
          })
        }
      }
    };

    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing",() => setIsTyping(true));
      socket.on("stop typing",() => setIsTyping(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {
      fetchMessages();

      selectedChatCompare = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedChat]);

    useEffect(() => {
      socket.on("message recieved",(newMessageRecieved) => {
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id
          ){
            if(!notification.includes(newMessageRecieved)){
              setNotification([newMessageRecieved, ...notification]);
              setFetchAgain(!fetchAgain);
            }
        }else{
          setMessages([...messages,newMessageRecieved]);
        }
      })
    });

    const typingHandler = (e) => {
      setNewMessage(e.target.value);

      // Typing indicator logic
      if(!socketConnected) return;

      if(!typing){
        setTyping(true);
        socket.emit("typing",selectedChat._id);
      }
      let lastTypingTime = new Date().getTime();
      var timerLength = 2000;
      setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;

        if(timeDiff >= timerLength && typing){
          socket.emit("stop typing", selectedChat._id);
          setTyping(false);
        }
      },timerLength)
    };
  return (
    <>
      {selectedChat ? (
        <>
        <Text
        fontSize={{base:"28px", md:"30px"}}
        pb={3}
        px={2}
        w={"100%"}
        display={"flex"}
        justifyContent={{base:"space-between"}}
        alignItems={"center"}
        >
            <IconButton
            display={{base:"flex", md:"none"}}
            icon={<ArrowBackIcon/>}
            onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
                <>
                <Text color={"white"}>
                {getSender(user,selectedChat.users)}
                </Text>
                
                <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                </>
            ) : (
                <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
                />
                </>
            )}
        </Text>
        <Box
        display={"flex"}
        flexDir={"column"}
        justifyContent={"flex-end"}
        p={3}
        backgroundColor={"#E8E8E8"}
        width={"100%"}
        height={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
        >
            {loading ? (
              <Spinner
              size={"xl"}
              w={20}
              h={20}
              alignSelf={"center"}
              margin={"auto"}
              />
            ): (
              <div className='messages'>
                <ScrollableChat messages={messages}/>
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <div style={{height:"60px",width:"80px"}}>
                <Lottie
                animationData={typingAnimation}
                />
              </div> : null}
              <Box display={"flex"}>
              <Input
              variant={"filled"}
              bg={"#E0E0E0"}
              placeholder='Enter a new message...'
              onChange={typingHandler}
              value={newMessage}
              />
              <div className='sendButton' onClick={sendmessageByButton} style={{display:"flex", cursor:"pointer",alignItems:"center",justifyContent:"center",marginLeft:"10px"}}>
                <Send/>
              </div>
              </Box>
            </FormControl>
        </Box>
        </>
      ) : (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} h={"100%"}>
            <Text color={"white"} fontSize={"3xl"} pb={3}>
                Click on a user to start chatting
            </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat
