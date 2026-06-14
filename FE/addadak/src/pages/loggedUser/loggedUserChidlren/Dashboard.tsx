import { Outlet } from "react-router-dom";
import LoggedHeader from "../../../components/LoggedComp/LoggedHeader";
const Dashboard=()=>{

    return(
        <>
            
            <Outlet></Outlet>
        </>
    )

}

export default Dashboard;