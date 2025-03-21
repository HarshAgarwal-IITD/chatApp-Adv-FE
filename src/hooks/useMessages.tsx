import { useEffect, useState } from "react";
import axios from 'axios'
import { BACKEND_URL, ROOM_ROUTE } from "@/utils/utils";



export default function useMessage({roomId}:{roomId:string}){
    const [messages,setMessages]=useState();
    useEffect(()=>{
        if (!roomId){
            
            return
        };

        const fetchMessages = async()=>{

            try{
                const response =await axios.get(BACKEND_URL+ROOM_ROUTE+roomId+'/messages',{
                    headers:{
                        authorization: localStorage.getItem('token')
                }});
                setMessages(response.data.messages)
            }
            catch(e){
                console.log('failed to fetch messages',e);
            }

        }
        fetchMessages();
        
        

    },[roomId])
  
    return messages;

}