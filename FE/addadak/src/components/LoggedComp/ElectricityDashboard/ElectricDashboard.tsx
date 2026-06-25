import ChartDashboard from "../ChartDashboard";
import TierDashboard from "../TierDashboard";
const ElectricDashboard=()=>{
    return(
        <div className="flex flex-row w-fill min-w-0 justify-center items-center">

            <ChartDashboard></ChartDashboard>
            <TierDashboard></TierDashboard>

        </div>
    )
}

export default ElectricDashboard;