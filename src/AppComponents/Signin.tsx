import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
  
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import GoogleSignIn from "@/AppComponents/GoogleSignin";

import axios from "axios";
import { SIGNIN_ROUTE,BACKEND_URL } from "@/utils/utils";
import Loader from "./loader";
import { useState,useRef } from "react";


export default function Signin({setLogin,setUsername  }:{setLogin:any,setUsername:any,}){
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
      const [loading, setLoading] = useState(false);
      const [open, setOpen] = useState(false);
      const [message,setMessage]= useState<String>("")
   
    const signinUser=async()=>{
      if(emailRef.current==null || passwordRef.current==null || emailRef.current?.value.trim()=="" || passwordRef.current?.value.trim()=="" )
      {  
        setMessage( "invalid input")
        return;
      }

      try {
        setLoading(true);
  
        const response = await axios.post(BACKEND_URL + SIGNIN_ROUTE, {
          email: emailRef.current.value,
          password: passwordRef.current.value,

         
        });
  
        console.log(response);
        const token = response.data.token;
        
        localStorage.setItem("token",token);
        
        setMessage( "SignIn success");
        setUsername(response.data.username)
        
        
        setLogin(true);
  
        // ✅ Close the dialog after successful signup
        setTimeout(()=>{
          setOpen(false);
        },1000)
        
      } catch (error) {
        console.error("Signin error:", error);
        //@ts-ignore
        setMessage( "Signin failed")
        
      } finally {
        setLoading(false);
      }


    }
    return(
     
      
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button  onClick={() => setOpen(true)} className="bg-gray-300 m-2 text-black cursor-pointer hover:bg-gray-50 " variant="outline">SignIn</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-black border-white text-white">
              <DialogHeader className="flex justify-center flex-row text-center">
                <DialogTitle>Sign In</DialogTitle>
               
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    email id
                  </Label>
                  <Input ref={emailRef}  id="email" placeholder="email id" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input ref={passwordRef} id="password" placeholder="password" className="col-span-3" />
                </div>
  
                <div className="bg-gray-250 px-3 py-1 text-center text-white 
           text-xl  hover:bg-white hover:text-black transition-all ease-in-out delay-100"><GoogleSignIn 
  setLoading={setLoading}
  setLogin={setLogin}
  setMessage={setMessage}
  setOpen={setOpen}
  setUsername={setUsername}
  
/></div>
                {message!=="" ?<div className="px-3 py-1 text-center text-blue-600 text-xl">
            {message}
          </div>:null}
              </div>
              <DialogFooter >
                 {loading ? (
                            <div className="flex w-full flex-row justify-center gap-2">
                              <Loader />
                            </div>
                          ) : (
                            <div className="flex w-full flex-row justify-center gap-2">
                              <Button
                                onClick={signinUser}
                                type="submit"
                                className="bg-gray-300 m-2 text-black cursor-pointer hover:bg-gray-50"
                                disabled={loading} // ✅ Disable while loading
                              >
                                SignIn
                              </Button>
                              <Button
                                onClick={() => setOpen(false)} // ✅ Close on cancel
                                type="button"
                                className="bg-black m-2 border-black border-2 text-white cursor-pointer hover:border-white"
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                
                </DialogFooter>
            </DialogContent>
          </Dialog>
        
      
      
    
  
    )
  }
  