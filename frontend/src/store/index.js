import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducers";

const userInfoFromLocalStorage = localStorage.getItem("account")
  ? JSON.parse(localStorage.getItem("account"))
  : null;

const initialState = {
  user: { userInfo: userInfoFromLocalStorage },
};

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: initialState,
});

export default store;
