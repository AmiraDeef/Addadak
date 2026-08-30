import ElectricityBadge from "../Badges/ElectricityBadge";
import GasBadge from "../Badges/GasBadge";
import WaterBadge from "../Badges/WaterBadge";
import HomeCards from "../RootHomeComp/HomeCards";
import checkList from "../../assets/chechlistIcon.png"
import chart from "../../assets/chartIcon.png"
import credit from "../../assets/creditIcon.png"
import { Link } from "react-router-dom";

const RootBody=()=>{
    return (
        <section className="mt-12 md:mt-20 flex flex-col gap-10 md:gap-16 px-4 md:px-8 ">

            <div className="texts text-center flex flex-col gap-10">
                <h1 className="text-5xl font-bold">Take Control of your Energy Costs.</h1>
                <h5 className="text-xl">Monitor, analyze and optimize your electricity and gas consumption with intelligent insights.</h5>
                <h5 className="text-xl text-red-500">Click Login for Demo.</h5>
            </div>

            <div className="badges flex flex-wrap md:flex-row justify-center gap-8 md:gap-20">
                <div className="elec flex flex-col items-center gap-5">
                    <ElectricityBadge></ElectricityBadge>
                    <p>Electricity</p>
                </div>
                <div className="gas flex flex-col items-center gap-5">
                    <GasBadge></GasBadge>
                    <p>Gas</p>
                </div>

                <div className="water flex flex-col items-center gap-5">
                    <WaterBadge></WaterBadge>
                    <p>Water</p>
                </div>
            </div>

            <div className="getStarted flex justify-center">

                <button className="bg-blue
                     duration-300 py-5
                     px-5 rounded
                     rounded-20
                     text-my-white 
                     border border-black 
                     font-bold 
                     hover:bg-my-white 
                     hover:text-black 
                     hover:cursor-pointer" >
                    <Link to="/user/register">Get started - Register </Link> 
                </button>

            </div>

            <div className="cards flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-8 lg:gap-12 max-w-6xl mx-auto w-full">
                <HomeCards children={<img src={checkList} width={100}></img>} title="Register & Login" desc="Create your account and access your personalized energy dashboard instantly"></HomeCards>
                <HomeCards children={<img src={chart} width={100}></img>} title="Track Appliances" desc="Monitor individual appliance consumption and identify energy hogs in real-time" ></HomeCards>
                <HomeCards children={<img src={credit} width={100}></img>} title="Manage Credit" desc="Top up and track your prepaid energy credit with smart duration estimates." ></HomeCards>
            </div>

        </section>
    );
}
export default RootBody;