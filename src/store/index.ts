import { configureStore } from "@reduxjs/toolkit";
import issuesReducer from "./slices/issuesSlice";
import repoReducer from "./slices/repoSlice";

export const store = configureStore({
  reducer: {
    issues: issuesReducer,
    repo: repoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
