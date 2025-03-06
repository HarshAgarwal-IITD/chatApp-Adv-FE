import { useState ,useRef,useEffect} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function ChatApp() {
  const [messages, setMessages] = useState<string[]>([]);
  //@ts-ignore
  const wsRef= useRef();
  const [input, setInput] = useState("");
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(()=>{
     const ws = new WebSocket('http://localhost:8080');
    ws.onmessage=(e)=>{
 
     setMessages(m=>[...m,e.data])
     
    }
    wsRef.current=ws;
    ws.onopen=()=>{
      ws.send(JSON.stringify({
        type:'join',
        payload:{
          roomId:"room1"
        }
      }))
    }
    return () => {
      ws.close();
    };
  },[])
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      
      //@ts-ignore
      wsRef.current.send(JSON.stringify({
        type:'chat',
        payload:{
          roomId:"room1",
          message:input
        }
      }));
      setInput("");
    }
   
    
  };

  return (
    
    <div className="bg-black w-screen h-screen flex  ">

    <div className="max-w-md w-2xl mx-auto my-auto p-4 bg-gray-300 space-y-4 rounded-2xl ">
      {/* Messages Display */}
      <Card className="h-96 bg-gray-100 border-0 ">
        <ScrollArea className="h-full p-2 ">
          <CardContent className="flex flex-col p-0" >
            {messages.map((msg, index) => (
              <div key={index} ref={index === messages.length - 1 ? lastMessageRef : null} className="p-2 self-end ml-auto w-fit bg-black text-white rounded-md mb-2">
                {msg}
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
        className="bg-black  border-black text-white border-0"
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
