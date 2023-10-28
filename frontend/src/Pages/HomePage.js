import React, { useEffect } from "react";
import {Container,Box,Text} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/SignUp';
import { useHistory } from 'react-router-dom';
import logoAnimation from "../animations/animatedLogo.json";
import Lottie from "lottie-react";

const HomePage = () => {
    const history = useHistory();
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) history.push("/chats");
    },[history]);

    
  return (
    <Container maxW={"xl"} centerContent backgroundColor={"#9ea9ff"} borderRadius={"10px"} margin={"5px auto"}>
        <Box
        display="flex"
        justifyContent="center"
        p={3}
        backgroundColor={"#9ea9ff"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        >
            <div style={{height:"60px", width:"60px"}}>
                <Lottie
                animationData={logoAnimation}
                />
            </div>
            <Text fontFamily={"'Cairo Play', sans-serif"} fontSize="4xl">
                Baatein-Karo
            </Text>
        </Box>
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
            <Tabs isFitted variant="soft-rounded">
              <TabList mb="1em">
                <Tab>Login</Tab>
                <Tab>Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Signup />
                </TabPanel>
              </TabPanels>
            </Tabs>
        </Box>
    </Container>
  )
}

export default HomePage;
