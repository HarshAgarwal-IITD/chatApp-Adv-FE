import { useState ,useRef,useEffect} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "./components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"



export default function App() {
  interface Message{
    type:'self'|'member'|'dialogue',
    message:String
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const[roomId,setRoomId]= useState<string>();
  //@ts-ignore
  const wsRef= useRef();
  const [inRoom , setInRoom] = useState(false);
  const [input, setInput] = useState("");
  const [openJoin, setOpenJoin] = useState(false);
  const [openExit, setOpenExit] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(()=>{
     const ws = new WebSocket('wss://chat-be-production-0b5b.up.railway.app/');
    ws.onmessage=(e)=>{
     
      const parsedMessage=JSON.parse(e.data) ;
     setMessages(m=>[...m,{type:parsedMessage.type, message:parsedMessage.message}])
    
     
    }
    wsRef.current=ws;
    
    return () => {
      ws.close();
    };
  },[])
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if(!inRoom){
      alert('you need to be in a room  to send messages')
      return;

    }
    if (input.trim()) {
      
      //@ts-ignore
      wsRef.current.send(JSON.stringify({
        type:'chat',
        payload:{
          roomId:"room1",
          message:input
        }
      }));

      setMessages(m=>[...m,{type:'self',message:input}])
      
      setInput("");
    }
   
    
  };
  const joinRoom = () => {
    //if in a room check
    if(inRoom){
      alert('already in a room exit the room first')
      return
    }
    if (roomId?.trim()) {
      onJoin(); // Call the function to handle room joining
 
      setOpenJoin(false); // Close the popover
    }
  };
  const onJoin=()=>{
//@ts-ignore
    wsRef.current.send(JSON.stringify({
      type:'join',
      payload:{
        roomId:roomId,
      }
        })
      
      )
      setInRoom(true);
      }

  const onExit = () =>{
    if(!inRoom){
      alert('you need to be in a room first to exit')
      return
    }
    //@ts-ignore
    wsRef.current.send(JSON.stringify({
      type:'exit',
      payload:{
        roomId:roomId,
      }
        })
      
      )
      setOpenExit(false)
      setInRoom(false);


  }

  return (
    
    <div className="bg-black w-screen h-screen flex  flex-col ">
      <div className=" flex md:flex-row flex-col   justify-between m-2">
        <div>  
  
          <div className="text-white md:ml-10 text-2xl p-2  flex items-center justify-center">Roomid : {inRoom ? roomId: "none"}</div>
          
        </div>
        <div className=" justify-between flex" >  
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
            
              <Button onClick={joinRoom} className="bg-black text-white ">
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
            <Button onClick={onExit} className="bg-black mr-2 text-white ">
                Exit
              </Button>
              <Button onClick={()=>setOpenExit} className="bg-white text-black ">
                cancel
              </Button>
            </div>
            
            </div>
          </PopoverContent>
        </Popover>
      
        </div>
     
      </div>
     

    <div className="max-w-screen w-2xl mx-auto  p-4 bg-gray-300 space-y-4 md:rounded-2xl ">
      {/* Messages Display */}
      <Card className="h-96 bg-gray-100 border-0 ">
        <ScrollArea className="h-full p-2 ">
          <CardContent className="flex flex-col p-0" >
            {messages.map((msg, index) => (
              <div key={index} ref={index === messages.length - 1 ? lastMessageRef : null} className={`p-2 
               ${msg.type === "dialogue" ? "self-center m-auto bg-gray-300 text-black" : ""}
                ${msg.type === "self" ? "self-end bg-black text-white" : ""}
                ${msg.type === "member" ? "self-start mr-auto  bg-gray-500 text-black" : ""}
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
      <Button className="bg-black text-white " onClick={sendMessage}>Send</Button>
      </div>
    </div>
    </div>

  );
}
