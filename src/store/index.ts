import { configureStore } from "@reduxjs/toolkit";
import profileDraftReducer from "./slices/profileDraftSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      profileDraft: profileDraftReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
