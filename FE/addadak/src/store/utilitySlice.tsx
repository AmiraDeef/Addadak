import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
//state interface
interface utilityState {
    utility: string,
  
}
//initial state
const initialState: utilityState = {
    utility: "electricity",
   
};
//slice

const utilitySlice = createSlice({
    name: "utility",
    initialState,
    reducers: {
        utilityHandler(state, action: PayloadAction<{
            utility: string

        }>) {
            state.utility = action.payload.utility;
          
        }
    }
})

export const { utilityHandler } = utilitySlice.actions;
export default utilitySlice.reducer;