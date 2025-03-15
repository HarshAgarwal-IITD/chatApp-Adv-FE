import { BACKEND_URL,GOOGLE_SIGNIN_ROUTE } from "@/utils/utils";
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import GoogleIcon from "./icons/googleIcon";

export default function GoogleSignIn( {setLoading,setLogin,setMessage,setOpen,setUsername}:
  {setLoading:any,
    setLogin:any,
    setMessage:any,
    setOpen:any,
    setUsername:any,
  }){
   // ✅ Google Sign-In
   const signInWithGoogle = async (
   ) => {
    try {
      setLoading(true);

      // 🔥 Sign in with Firebase
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result)
      const token = await result.user.getIdToken();

      // 🚀 Send token to backend
      const response = await axios.post(
        `${BACKEND_URL}${GOOGLE_SIGNIN_ROUTE}`,
        { token },
        { withCredentials: true }
      );

      console.log("Google sign-in response:", response.data);
      setMessage("Google SignIn success");
      setUsername(result.user.displayName)
      setLogin(true);


      setTimeout(() => {
        setOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Google Sign-in error:", error);
      setMessage("Google SignIn failed");
    } finally {
      setLoading(false);
    }
   
  };
  return (
    <div className="flex justify-center gap-4 hover:cursor-pointer">
      <div><GoogleIcon></GoogleIcon></div>
      <button onClick={signInWithGoogle}>
        Continue with Google
      </button>
    </div>
  );
}
  

  

