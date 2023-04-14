import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch } from "../store"; // импортируем типы стора

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

export const fetchRepos: any = (repo: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(reposSlice.actions.setLoading());

    try {
      const response = await axios.get<Repo[]>(
        `https://api.github.com/repos/${repo}/issues`
      );
      const repos = response.data;
      dispatch(reposSlice.actions.setRepos(repos));
    } catch (error: any) {
      dispatch(reposSlice.actions.setRepos([]));
      dispatch(reposSlice.actions.setError(error.message));
    }
  };
};

export interface Repo {
  id?: number;
  key?: number;
  title: string;
  number: number;
  user: { login: string };
  comments: number;
}

export interface ReposState {
  repos: Repo[];
  loading: boolean;
  error: string | null;
}

export const { setLoading, setRepos, setError } = reposSlice.actions;

export default reposSlice.reducer;
