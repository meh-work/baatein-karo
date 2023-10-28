import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%", backgroundColor:"white" }}>
      {user && <SideDrawer/>}
      <Box 
      display="flex" justifyContent="space-between" w="100%" h="87vh" p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  );
};

export default Chatpage;