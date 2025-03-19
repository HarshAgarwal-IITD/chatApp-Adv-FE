import {
    Dialog,
    DialogContent,
   
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog";

  import { Button } from "@/components/ui/button";

  import {  useState } from "react";
  import { BACKEND_URL, SIGNOUT_ROUTE } from "@/utils/utils";
  import axios from "axios";
  import Loader from "./loader"

export default function Logout({setLogin,setUsername,handleLogout}:{setLogin:any,setUsername:any,handleLogout:()=>any}){
  
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [_,setMessage]= useState<String>("");

    const logoutUser=async()=>{
        try{
            const token = localStorage.getItem("token");
            setLoading(true)
           const response = await axios.post(BACKEND_URL+SIGNOUT_ROUTE,{}, { headers: {
            authorization: token
          }}
           );
           console.log(response);
          
           setMessage( "logout success");
           setLogin(false);
           setUsername()
           handleLogout();
            // ✅ Close the dialog after successful signup
            setTimeout(()=>{
            setOpen(false);
            },1000)
      
        }
        catch (error) {
            console.error("logout error:", error);
            //@ts-ignore
            setMessage("logout failed")
            
          } finally {
            setLoading(false);
            

          }
    }

    return (
        <Dialog  open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              className="bg-gray-300 m-2 text-black cursor-pointer hover:bg-gray-50"
              variant="outline"
            >
              LogOut
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-black border-white text-white">
           
            <div className="flex text-2xl justify-center text-white font-bold text-center">Logout....?</div>
            
             {/* Footer */}
            <DialogFooter>
              {loading ? (
                <div className="flex w-full flex-row justify-center gap-2">
                  <Loader />
                </div>
              ) : (
                <div className="flex w-full flex-row justify-center gap-2">
                  <Button
                    onClick={logoutUser}
                    type="submit"
                    className="bg-gray-300 m-2 text-black cursor-pointer hover:bg-gray-50"
                    disabled={loading} // ✅ Disable while loading
                  >
                    LogOut
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
    

