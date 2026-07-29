import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  nid: string;
  id: string;
}

const initialState: AuthState = {
  nid: "",
  id: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ nid: string; id: string }>) {
      state.nid = action.payload.nid;
      state.id = action.payload.id;
    },
    logout(state) {
      state.nid = "";
      state.id = "";
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
