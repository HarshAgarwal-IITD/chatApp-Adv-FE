import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import GoogleSignIn from "@/AppComponents/GoogleSignin";
import { useRef, useState } from "react";
import { BACKEND_URL, SIGNUP_ROUTE } from "@/utils/utils";
import axios from "axios";
import Loader from "./loader";

export default function Signup({setLogin,setUsername}:{setLogin:any,setUsername:any,}) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);


  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message,setMessage]= useState<String>("")
  
  const signupUser = async () => {
  
    
    if (
      emailRef.current == null ||
      passwordRef.current == null ||
      usernameRef.current == null ||
      emailRef.current?.value.trim() === "" ||
      passwordRef.current?.value.trim() === "" ||
      usernameRef.current?.value.trim() === ""
    ) {
      setMessage( "invalid input")
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(BACKEND_URL + SIGNUP_ROUTE, {
        email: emailRef.current.value,
        password: passwordRef.current.value,
        username: usernameRef.current.value,
      });

      console.log(response);
      setMessage( "Signup success , plz signin")
      

      // ✅ Close the dialog after successful signup
      setTimeout(()=>{
        setOpen(false);
        

      },1000)
      
    } catch (error) {
      console.error("Signup error:", error);
      //@ts-ignore
      setMessage("Signup failed")
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="bg-gray-300 m-2 text-black cursor-pointer hover:bg-gray-50"
          variant="outline"
        >
          SignUp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black border-white text-white">
        <DialogHeader className="flex justify-center flex-row text-center">
          <DialogTitle>Sign Up</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {/* Name Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              ref={usernameRef}
              id="name"
              placeholder="Name"
              className="col-span-3"
            />
          </div>

          {/* Email Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email ID
            </Label>
            <Input
              ref={emailRef}
              id="email"
              placeholder="Email ID"
              className="col-span-3"
              type="email"
            />
          </div>

          {/* Password Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              ref={passwordRef}
              id="password"
              placeholder="Password"
              className="col-span-3"
              type="password"
            />
          </div>

          {/* Google Signin */}
          <div className=" bg-gray-250 px-3 py-1 text-center text-white 
           text-xl cursor-pointer hover:bg-white hover:text-black transition-all ease-in-out delay-100">
          <GoogleSignIn 
  setLoading={setLoading}
  setLogin={setLogin}
  setMessage={setMessage}
  setOpen={setOpen}
  setUsername={setUsername}

/>
          </div>
         {message!=="" ?<div className="px-3 py-1 text-center text-blue-600 text-xl">
            {message}
          </div>:null}
        </div>

        {/* Footer */}
        <DialogFooter>
          {loading ? (
            <div className="flex w-full flex-row justify-center gap-2">
              <Loader />
            </div>
          ) : (
            <div className="flex w-full flex-row justify-center gap-2">
              <Button
                onClick={signupUser}
                type="submit"
                className="bg-gray-300 m-2 text-black cursor-pointer hover:bg-gray-50"
                disabled={loading} // ✅ Disable while loading
              >
                SignUp
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
  );
}
