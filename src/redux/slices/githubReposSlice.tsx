import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../store"; // импортируем типы стора

export interface Repo {
  id: number;
  name: string;
  html_url: string;
}

export interface ReposState {
  repos: Repo[];
  loading: boolean;
  error: string | null;
}

const initialState: ReposState = {
  repos: [],
  loading: false,
  error: null,
};

export const reposSlice = createSlice({
  name: "repos",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setRepos: (state, action: PayloadAction<Repo[]>) => {
      state.repos = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const fetchRepos: any = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(reposSlice.actions.setLoading());

    try {
      const response = await axios.get<Repo[]>(
        "https://api.github.com/repos/facebook/react/issues"
      );
      const repos = response.data;
      dispatch(reposSlice.actions.setRepos(repos));
    } catch (error: any) {
      dispatch(reposSlice.actions.setError(error.message));
    }
  };
};

export const { setLoading, setRepos, setError } = reposSlice.actions;

export default reposSlice.reducer;
