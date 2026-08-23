import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface utilityState {
  //utility: string;
  meterNumber: string;
  //meterType: string;
  allMeters:Array<any>
}

interface consumptionsState {
  consumps:Array<any>
}
/*
const initialState: utilityState = {
  //utility: "Electricity",
  meterNumber: "",
  //meterType: "",
  allMeters:[],
};*/

const initialState: consumptionsState={
  consumps:[]
};

const utilitySlice = createSlice({
  name: "utility",
  initialState,
  reducers: {
    /*
    utilityHandler(state, action: PayloadAction<{  meterNumber: string ,allMeters:Array<any>}>) {
      //state.utility = action.payload.utility;
      state.meterNumber = action.payload.meterNumber;
      //state.meterType=action.payload.meterType;
      state.allMeters=action.payload.allMeters
    },*/

    consumptions(state, action:PayloadAction <{consumps:Array<any>}>){
        state.consumps=action.payload.consumps;
    }
    
  },
});

export const { consumptions } = utilitySlice.actions;
export default utilitySlice.reducer;