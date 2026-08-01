import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  nid: string;
  id: string;
  firstName:string
}

const initialState: AuthState = {
  nid: "",
  id: "",
  firstName:"",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ nid: string; id: string; firstName:string }>) {
      state.nid = action.payload.nid;
      state.id = action.payload.id;
      state.firstName=action.payload.firstName;
    },
    logout(state) {
      state.nid = "";
      state.id = "";
      state.firstName="";
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
