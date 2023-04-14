import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: ReposState = {
  repos: [],
  status: null,
};

export const fetchIssues = createAsyncThunk(
  "issues/fetchIssuesStatus",
  async (repo: string) => {
    const { data } = await axios.get<Repo[]>(
      `https://api.github.com/repos/${repo}/issues`
    );
    return data;
  }
);

export const reposSlice = createSlice({
  name: "repos",
  initialState,
  reducers: {
    setRepos: (state, action: PayloadAction<Repo[]>) => {
      state.repos = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIssues.pending, (state) => {
      state.status = "loading";
      state.repos = [];
    });
    builder.addCase(fetchIssues.fulfilled, (state, { payload }) => {
      state.repos = payload;
      state.status = "success";
    });
    builder.addCase(fetchIssues.rejected, (state) => {
      state.status = "error";
      state.repos = [];
    });
  },
});

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
  status: null | string;
}

export default reposSlice.reducer;
