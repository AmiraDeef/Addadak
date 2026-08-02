import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import consumptionsReducer from "./consumptionSlice"
import utilityReducer from "./utilitySlice"


const store = configureStore({
  reducer: {
    auth: authReducer,
    consumptions:consumptionsReducer,
    utility:utilityReducer,

    
  },
});

// These types let us use useSelector and useDispatch with full TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
