import SpeedoMeter from "../assets/SpeedoMeter.gif"
import { NavLink } from "react-router-dom";

 interface LogoProps{
        textcolor: string;
        logowidth: number;
    }

const Logo=({textcolor,logowidth}:LogoProps)=>{
    return (
        <NavLink to="/">
            <div className="logo flex flex-row items-center gap-4 ">
                <img src={SpeedoMeter} alt="" className="mb-3" width={logowidth}/>
                {
                    textcolor==="purple"?
                        
                            <h2 className="font-bold text-shadow-lg text-2xl text-secondary-purple">
                                <span className="text-3xl">ع</span>addadak
                            </h2>
                        :
                     
                        
                            <h2 className="font-bold text-shadow-lg text-2xl text-my-white">
                                <span className="text-3xl">ع</span>addadak
                            </h2>
                        
                    
                }
                
            </div>
        </NavLink>   
    );
}

export default Logo;