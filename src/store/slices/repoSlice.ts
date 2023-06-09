import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: repoState = {
  repoURL: undefined,
  ownerURL: undefined,
  name: "",
  stars: null,
  statusRepo: null,
};

export const fetchRepo = createAsyncThunk(
  "repo/fetchRepo",
  async (repo: string) => {
    const { data } = await axios.get<RepoData>(
      `https://api.github.com/repos/${repo}`
    );
    return data;
  }
);

export const repoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRepo.pending, (state) => {
      state.statusRepo = "loading";
      state.repoURL = undefined;
    });
    builder.addCase(fetchRepo.fulfilled, (state, { payload }) => {
      state.name = payload.full_name;
      state.repoURL = payload.html_url;
      state.ownerURL = payload.owner.html_url;
      state.stars = payload.stargazers_count;
      state.statusRepo = "success";
    });
    builder.addCase(fetchRepo.rejected, (state) => {
      state.statusRepo = "error";
      state.repoURL = undefined;
      state.stars = null;
      state.name = "";
    });
  },
});

interface repoState {
  name: string;
  repoURL: undefined | string;
  ownerURL: undefined | string;
  stars: null | number;
  statusRepo: null | string;
}

interface RepoData {
  html_url: string;
  full_name: string;
  stargazers_count: number;
  owner: { html_url: string };
}

export default repoSlice.reducer;
