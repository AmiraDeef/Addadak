import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface consumptionsState {
  consumptionTable:Array<any>
}

const initialState: consumptionsState={
  consumptionTable:[]
};

const consumptionsSlice = createSlice({
  name: "consumptions",
  initialState,
  reducers: {
    consumptions(state, action:PayloadAction <{consumptionTable:Array<any>}>){
        state.consumptionTable=action.payload.consumptionTable;
    }
    
  },
});

export const { consumptions } = consumptionsSlice.actions;
export default consumptionsSlice.reducer;