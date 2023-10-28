import React, { useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { useState } from 'react';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({fetchAgain}) => {
  const [loggedUser,setLoggedUser] = useState();
  const {selectedChat,setSelectedChat,user,chats,setChats}=ChatState();

  const toast = useToast();

  const fetchChats = async() => {
    try {
      const config = {
        headers: {
          Authorization : `Bearer ${user.token}`,
        },
      }

      const {data} = await axios.get("/api/chat",config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title:"Error Occured!",
        description:"Failed to Load the chats",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left"
      })
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[fetchAgain]);

  return (
    <Box
    display={{base: selectedChat ? "none" : "flex", md:"flex"}}
    flexDir={"column"}
    alignItems={"center"}
    p={3}
    backgroundColor={"#474790"}
    w={{base:"100%", md:"38%"}}
    borderRadius={"lg"}
    borderWidth={"1px"}
    >
      <Box
      pb={3}
      px={3}
      fontSize={{base:"25px", md:"28px"}}
      display={"flex"}
      w={"100%"}
      justifyContent={"space-between"}
      alignContent={"center"}
      >
        <Text color={"white"}>
          My Chats
        </Text>
        <GroupChatModal>
          <Button
          display={"flex"}
          fontSize={{base:"17px",md:"12px",lg:"17px"}}
          rightIcon={<AddIcon backgroundColor={"white"} borderRadius={"full"} height={"20px"} width={"20px"} color={"#1e5cae"}/>}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
      display={"flex"}
      flexDir={"column"}
      p={3}
      bg={"#F8F8F8"}
      w={"100%"}
      h={"100%"}
      borderRadius={"lg"}
      overflow={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
              onClick={() => setSelectedChat(chat)}
              cursor={"pointer"}
              bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
              color={selectedChat === chat ? "white" : "black"}
              px={3}
              py={2}
              borderRadius={"lg"}
              key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? (
                    getSender(loggedUser,chat.users)
                  ):chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading/>
        )}
      </Box>
    </Box>
  )
}

export default MyChats
