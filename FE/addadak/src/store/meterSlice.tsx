import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
//state interface
interface meterSlice {

    meterNumber: string,
    meterType: string

}
//initial state
const initialState: meterSlice = {
    meterNumber: "",
    meterType: "",
   
};
//slice

const meterSlice = createSlice({
    name: "meter",
    initialState,
    reducers: {
      setMeterData(state, action: PayloadAction<{
            meterNumber?: string;
            meterType?: string;
            
        }>) {
           if (action.payload.meterNumber !== undefined) {
                state.meterNumber = action.payload.meterNumber;
            }
            if (action.payload.meterType !== undefined) {
                state.meterType = action.payload.meterType;
            }
            
        },setMeterNumber(state, action: PayloadAction<string>) {
            state.meterNumber = action.payload;
        },
        setMeterType(state, action: PayloadAction<string>) {
            state.meterType = action.payload;
        },
      
    }
})

export const { setMeterData, setMeterNumber, setMeterType } = meterSlice.actions;
export default meterSlice.reducer;