import axios from "axios";
import { useEffect } from "react";

const UserProfile=()=>{
    
    return(
        <div className="card ">
            <div className="userIcon"></div>
            <div className="info">
                <div className="fullName">
                    <div className="firstName">


                    </div>
                    <div className="lastName">

                    </div>
                </div>
                <div className="ageAndEmail">
                    <div className="age">

                    </div>
                    <div className="email">
                        
                    </div>
                </div>
                <div className="numberAndID">
                    <div className="number">

                    </div>
                    <div className="id">
                        
                    </div>
                </div>
            </div>

        </div>
    );
}

export default UserProfile;