import ChartDashboard from "./ChartDashboard";
import TierDashboard from "./TierDashboard";
const ElectricDashboard=()=>{
    return(
        <div className="flex flex-col justify-center items-center">

            <ChartDashboard></ChartDashboard>
            <TierDashboard></TierDashboard>

        </div>
    )
}

export default ElectricDashboard;