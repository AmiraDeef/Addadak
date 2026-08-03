import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
//state interface
interface utilityState {
    utility: string,
    meterNumber: string,
    meterType: string
    allMeters: Array<any>
}
//initial state
const initialState: utilityState = {
    utility: "electricity",
    meterNumber: "",
    meterType: "",
    allMeters: [],
};
//slice

const utilitySlice = createSlice({
    name: "utility",
    initialState,
    reducers: {
        utilityHandler(state, action: PayloadAction<{
            utility: string
            meterNumber?: string;
            meterType?: string;
            allMeters?: Array<any>;

        }>) {
            state.utility = action.payload.utility;

            if (action.payload.meterNumber !== undefined) {
                state.meterNumber = action.payload.meterNumber;
            }
            if (action.payload.meterType !== undefined) {
                state.meterType = action.payload.meterType;
            }
            if (action.payload.allMeters !== undefined) {
                state.allMeters = action.payload.allMeters;
            }

            //state.meterNumber = action.payload.meterNumber;
            // state.meterType=action.payload.meterType;
            //state.allMeters=action.payload.allMeters
          
        },  setMeterNumber(state, action: PayloadAction<string>) {
            state.meterNumber = action.payload;
        }
    }
})

export const { utilityHandler ,setMeterNumber} = utilitySlice.actions;
export default utilitySlice.reducer;