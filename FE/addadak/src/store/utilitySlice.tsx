import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
//state interface
interface utilityState{
    utility:string,
    //meterNumber:string,
    //meterType:string
    //allMeters:Array<any>
}
//initial state
const initialState: utilityState = {
  utility: "Electricity",
 // meterNumber: "",
  //meterType: "",
  //allMeters:[],
};
//slice

const utilitySlice=createSlice({
    name:"utility",
    initialState,
    reducers:{
        utilityHandler(state, action: PayloadAction<{ utility:string}>) 
        {
            state.utility = action.payload.utility;
            //state.meterNumber = action.payload.meterNumber;
           // state.meterType=action.payload.meterType;
            //state.allMeters=action.payload.allMeters
        }
    }
})

export const { utilityHandler } = utilitySlice.actions;
export default utilitySlice.reducer;