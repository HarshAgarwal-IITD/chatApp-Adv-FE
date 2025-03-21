import { useState ,useRef,useEffect} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "./components/ui/input";
import Signin from "./AppComponents/Signin";
import Signup from "./AppComponents/Signup";
import Logout from "./AppComponents/Logout";
import axios from "axios"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BACKEND_URL, ROOM_ROUTE } from "./utils/utils";
import useMessage from "./hooks/useMessages";











export default function App() {
  interface Message{
    type:'self'|'member'|'dialogue',
    message:String,
    
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const[roomId,setRoomId]= useState<string>();
  const [inRoom , setInRoom] = useState(false);
  const [input, setInput] = useState("");
  const [openJoin, setOpenJoin] = useState(false);
  const [openExit, setOpenExit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [login , setLogin]=useState(false);
  const [username,setUsername]= useState<string>();
  const [roomTitle,setRoomTitle]= useState<string>();
  const messageUse = useMessage({ roomId:roomTitle as string }); // ✅ Use the hook directly
 



  useEffect(() => {
 
    // When new messages are fetched from the hook, merge them with existing state
    //@ts-ignore
    if (messageUse) {
      //@ts-ignore
      setMessages(messageUse); // ✅ Update state only if messages are fetched
    }
  }, [messageUse]);
  

  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  //@ts-ignore
  const wsRef= useRef<WebSocket>();
  
  //check for username
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);   

    const storedRoomId = localStorage.getItem("roomId");
    if (storedRoomId) {
      setRoomTitle(storedRoomId);
      setInRoom(true);
    }
  }, []);
    // ✅ Save to localStorage when roomTitle changes
    useEffect(() => {
      if (roomTitle) {
        localStorage.setItem("roomId", roomTitle);
      } else {
        localStorage.removeItem("roomId");
      }
    }, [roomTitle]);

  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username as string);
    } else {
      localStorage.removeItem("username");
    }
  }, [username]);

  
 
//check if logged in 
useEffect(()=>{
 
    const token = localStorage.getItem("token");
    if(token){
      setLogin(true)
    }

  
})
 
useEffect(() => {
  

 if(inRoom)
   { 
    const token = localStorage.getItem("token");
    if (!token) {
      alert('Login to join a room');
      return;
    }
    const ws = new WebSocket('wss://chatapp-advbe-production-b8a5.up.railway.app/', [token]);
    

    ws.onopen = () => console.log('WebSocket connected');

    ws.onmessage = (e) => {
      const parsedMessage = JSON.parse(e.data);
      setMessages(m => [...m, { type: parsedMessage.type, message: parsedMessage.message }]);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

   

    wsRef.current = ws;}
  

  // ✅ Close WebSocket when user exits room or logs out
  
}, [inRoom]); // ✅ Depend only on state to open/close connection


  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if(!inRoom){
      alert('you need to be in a room  to send messages')
      return;

    }
    if (!wsRef.current) {
      alert('WebSocket connection not established');
      return;
    }
    if (input.trim()) {
      
      
      wsRef.current.send(JSON.stringify({
        type:'chat',
        payload:{
          roomId:roomTitle,
          message:input
        }
      }));

      setMessages(m=>[...m,{type:'self',message:input}])
      
      setInput("");
    }
   
    
  };

  const createRoom=async()=>{
    if(inRoom){
      alert("already in a room ")
      return;
    }
    if (roomId?.trim()) {
      try{ const response = await axios.post(BACKEND_URL+ROOM_ROUTE+"create",{
        roomName:roomId,
       },{
        headers: {
          authorization: localStorage.getItem("token")
        }
      })
      console.log(response);
      setInRoom(true);
      alert("Room created successfully");
      setRoomTitle(roomId)

      setOpenCreate(false);
     
    }
      catch(e){
        alert('error creating room see console')
        console.error("error",e)
      }
  
 

    }

  }
  
  const joinRoom = () => {
    //if in a room check
    if(inRoom){
      alert('already in a room exit the room first')
      return
    }
    if (roomId?.trim()) {
      onJoin(); // Call the function to handle room joining
 
     
    }
  };
  const onJoin=async()=>{
   try{ const response = await axios.post(BACKEND_URL+ROOM_ROUTE+roomId+"/join",
    {
    },
   { headers: {
      authorization: localStorage.getItem("token")
    }}
    )
    console.log(response);
    setInRoom(true);
    setRoomTitle(roomId);
    setOpenJoin(false); // Close the popover
    
   
  }
    catch(e){
      alert('error joining room see console')
      console.error("error",e)
    }
  }
//@ts-ignore
    

  const onExit =async () =>{
    if(!inRoom){
      alert('you need to be in a room first to exit')
      return
    }
    try {
      const response = await axios.delete(
        BACKEND_URL + ROOM_ROUTE + roomId + "/exit",
        { headers: {
          authorization: localStorage.getItem("token")
        }}
      );

      console.log(response);
      setInRoom(false);
      setRoomTitle(undefined);
     
        wsRef.current.close();
      
      alert("Exited room successfully");

      // Remove roomId from localStorage
      localStorage.removeItem("roomId");
     

      setOpenExit(false);
    } catch (error) {
      console.error("Error exiting room:", error);
      alert("Error exiting room. See console for details.");
    }
 }
 
 const handleLogout = () => {
  
    wsRef.current.close();

  setLogin(false);
  setUsername(undefined);
  setRoomTitle(undefined); // ✅ Clear roomTitle on logout
  setInRoom(false);

  localStorage.removeItem("roomId");
  localStorage.removeItem("username");
  localStorage.removeItem("token");
};

/**
 * How to use inline code suggestions with GitHub Copilot:
 * 
 * 1. Start typing your code as usual.
 * 2. GitHub Copilot will automatically suggest code completions.
 * 3. You can accept a suggestion by pressing `Tab` or `Enter`.
 * 4. If you want to see more suggestions, press `Ctrl` + `Space`.
 * 5. You can also cycle through suggestions using the arrow keys.
 * 6. To dismiss a suggestion, press `Esc`.
 * 
 * Example:
 * 
 * // Start typing a function
 * function greet() {
 *   // GitHub Copilot might suggest the following line:
 *   console.log("Hello, World!");
 * }
 * 
 * // Press `Tab` to accept the suggestion.
 */

  return (
    
    <div className="bg-black w-screen h-screen flex  flex-col ">
     
      <div className=" flex md:flex-row flex-col   justify-between m-2">
      <div>
    {!login && <Signup setLogin={setLogin} setUsername={setUsername}   />}
    {!login &&   <Signin setLogin={setLogin} setUsername={setUsername} />}
    {login &&   <Logout setLogin={setLogin} setUsername={setUsername} handleLogout={handleLogout} />}
   {/* <Form text="Sign In"/> */}
      </div>
    { login && <div>  
  
          <div className="text-blue-600 md:ml-10 text-2xl p-2  flex items-center justify-center">Welcome {username}</div>
          
        </div>}
     
        <div>  
  
          <div className="text-white md:ml-10 text-2xl p-2  flex items-center justify-center">Roomid : {inRoom ? roomTitle: "none"}</div>
          
        </div>
        <div className=" justify-between flex" >  
        <Popover open={openCreate} onOpenChange={setOpenCreate}>
          <PopoverTrigger className="text-white">
            <Button  className="bg-gray-300 m-1  text-black cursor-pointer hover:bg-gray-50">
              Create Room
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-gray-300 p-2 rounded-lg mr-0">
            <div className="flex   gap-2">
              <Input
                value={roomId}
                onChange={(e)=>{setRoomId(e.target.value)}}
                placeholder="Enter Room ID"
                className="text-black p-2 rounded-md focus:border-black"
              />
            
              <Button onClick={createRoom} className="bg-black cursor-pointer text-white ">
                Create
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Popover open={openJoin} onOpenChange={setOpenJoin}>
          <PopoverTrigger className="text-white">
            <Button  className="bg-gray-300 m-1  text-black cursor-pointer hover:bg-gray-50">
              Join Room
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-gray-300 p-2 rounded-lg mr-0">
            <div className="flex   gap-2">
              <Input
                value={roomId}
                onChange={(e)=>{setRoomId(e.target.value)}}
                placeholder="Enter Room ID"
                className="text-black p-2 rounded-md focus:border-black"
              />
            
              <Button onClick={joinRoom} className="bg-black text-white cursor-pointer ">
                Join
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={openExit} onOpenChange={setOpenExit}>
          <PopoverTrigger className="text-white">
          <Button className="bg-gray-300 m-2 text-black cursor-pointer hover:bg-gray-50 ">Exit Room</Button>
          </PopoverTrigger>
          <PopoverContent className="bg-gray-300 p-2 w-fit rounded-lg mr-0">
            <div className="flex flex-col items-center  gap-2">
            <div className="p-2">You want to exit....? </div>
            <div>
            <Button onClick={onExit} className="bg-black mr-2 cursor-pointer text-white ">
                Exit
              </Button>
              <Button onClick={()=>setOpenExit(false)} className="bg-white cursor-pointer text-black ">
                cancel
              </Button>
            </div>
            
            </div>
          </PopoverContent>
        </Popover>
      
        </div>
     
      </div>
     

    <div className="max-w-screen w-2xl mx-auto  p-4 bg-gray-100 space-y-4 md:rounded-2xl ">
      {/* Messages Display */}
      <Card className="h-96 bg-gray-300 border-0 ">
        <ScrollArea className="h-full p-2 ">
          <CardContent className="flex flex-col p-0" >
            {messages.map((msg, index) => (
              <div key={index} ref={index === messages.length - 1 ? lastMessageRef : null} className={`p-2 
               ${msg.type === "dialogue" ? "self-center m-auto bg-gray-500 text-white" : ""}
                ${msg.type === "self" ? "self-end bg-black text-white" : ""}
                ${msg.type === "member" ? "self-start mr-auto bg-gray-100 text-blue-600 " : ""}
               w-fit rounded-md mb-2`}>
                {msg.message}
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Text Input */}
      <div className="flex gap-1  align-middle items-center">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
     className="bg-black text-white border-0 focus:border-black focus:ring-0
      focus:ring-transparent focus:outline-none focus-visible:border-black"

        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {  // Check if Enter is pressed without Shift
            e.preventDefault();  // Prevents new line
            sendMessage();
          }}}
      />

      {/* Send Button */}
      <Button className="bg-black text-white cursor-pointer hover:bg-blue-800 " onClick={sendMessage}>Send</Button>
      </div>
    </div>
    </div>

  );
}
