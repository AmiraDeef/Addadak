import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
//state interface
interface meterSlice {

    meterNumber: string,
    meterType: string,
    autoPay: boolean;
  autoPayAmount: number;

}
//initial state
const initialState: meterSlice = {
    meterNumber: "",
    meterType: "",
    autoPay: false,
    autoPayAmount: 0,

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

        }, setMeterNumber(state, action: PayloadAction<string>) {
            state.meterNumber = action.payload;
        },
        setMeterType(state, action: PayloadAction<string>) {
            state.meterType = action.payload;
        },
        setAutoPayData: (
    state,
    action: PayloadAction<{
        autoPay: boolean;
        autoPayAmount: number;
    }>
) => {
    state.autoPay = action.payload.autoPay;
    state.autoPayAmount = action.payload.autoPayAmount;
},
    }
})

export const { setMeterData, setMeterNumber, setMeterType, setAutoPayData } = meterSlice.actions;
export default meterSlice.reducer;