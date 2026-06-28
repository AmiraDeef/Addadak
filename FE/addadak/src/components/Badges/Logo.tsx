import SpeedoMeter from "../../assets/SpeedoMeter.gif"
import { NavLink } from "react-router-dom";

 interface LogoProps{
        textcolor: string;
        logowidth: number;
    }

const Logo=({textcolor,logowidth}:LogoProps)=>{
    return (
        <NavLink to="/">
            <div className="logo flex flex-row items-center gap-1.5 sm:gap-4">
                <img src={SpeedoMeter} alt="" className="mb-3   h-15" width={logowidth}/>
                {
                    textcolor==="purple"?
                        
                            <h2 className="font-bold text-shadow-lg text-lg sm:text-2xl text-secondary-purple whitespace-nowrap">
                                <span className="text-xl sm:text-3xl">ع</span>addadak
                            </h2>
                        :
                     
                        
                            <h2 className="font-bold text-shadow-lg text-lg sm:text-2xl text-my-white whitespace-nowrap">
                                <span className="text-xl sm:text-3xl">ع</span>addadak
                            </h2>
                        
                    
                }
                
            </div>
        </NavLink>   
    );
}

export default Logo;