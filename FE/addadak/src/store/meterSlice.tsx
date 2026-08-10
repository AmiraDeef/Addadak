import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface meterState {
  meterNumber:string
}

const initialState: meterState={
  meterNumber:""
};

const meterSlice = createSlice({
  name: "meter",
  initialState,
  reducers: {
    meter(state, action:PayloadAction <{meterNumber:string}>){
        state.meterNumber=action.payload.meterNumber;
    }
    
  },
});

export const { meter } = meterSlice.actions;
export default meterSlice.reducer;