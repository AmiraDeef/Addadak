import Water from "../../assets/WaterDrop.png"
const WaterBadge=()=>{
    return(
    <div className="rounded-full bg-secondary-purple hover:-translate-y-6 duration-300 ease-in-out w-30 h-30  shadow-lg shadow-blue  flex flex-row items-center justify-center">
        <img src={Water} alt="" width={70}  />
    </div>
    );
}
export default WaterBadge;
