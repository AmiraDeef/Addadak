//import usestate usecontext createcontext
import { createContext, useContext,useState, type ReactNode } from "react";
//------> create the auth context


interface props{
    children:ReactNode
}

interface attribute{
   
    nid:string,
    id:string,
    Login:(nid:string,id:string)=>void,
    Logout:()=>void
}

const AuthContext=createContext<attribute|null>(null) ;


//------->create auth provider
export  const  AuthProvider=({children}:props)=>{
    //create DATA to be stored from cookie
    
    const[nid,setNid]=useState("");
    const[id,setID]=useState("");

    const Login=( nid:string, id:string)=>{
        
        setNid(nid);
        setID(id);
    }

    const Logout=()=>{
        
        setNid("");
        setID("");
    }


    //
    return(
        <AuthContext.Provider value={{nid,id,Login,Logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const  useAuth=()=>useContext(AuthContext);