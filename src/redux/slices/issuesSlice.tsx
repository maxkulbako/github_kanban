import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: IssuesState = {
  repoURL: null,
  issues: {},
  todoIds: [],
  inProgressIds: [],
  doneIds: [],
  status: null,
};

export const fetchIssues = createAsyncThunk(
  "issues/fetchIssues",
  async (repo: string) => {
    const { data } = await axios.get<Issue[]>(
      `https://api.github.com/repos/${repo}/issues`
    );
    const issues = data.reduce((acc, issue) => {
      if (issue.id) {
        acc[issue.id] = issue;
      }
      return acc;
    }, {} as IssueMap);
    return issues;
  }
);

function saveStateToLocalStorage(state: IssuesState) {
  localStorage.setItem(`${state.repoURL}`, JSON.stringify(state));
}

export const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<string>) => {
      state.repoURL = action.payload;
    },
    getFromLocalStorage: (state, action: PayloadAction<string>) => {
      const localState = localStorage.getItem(action.payload);

      if (localState) {
        const parsedState = JSON.parse(localState);
        state.issues = parsedState.issues;
        state.todoIds = parsedState.todoIds;
        state.inProgressIds = parsedState.inProgressIds;
        state.doneIds = parsedState.doneIds;
        state.status = parsedState.status;
        console.log(state);
      }
    },

    moveIssue: (
      state,
      action: PayloadAction<{
        from: number;
        to: number;
        sourceColumn: "todoIds" | "inProgressIds" | "doneIds";
        destColumn: "todoIds" | "inProgressIds" | "doneIds";
      }>
    ) => {
      const { from, to, sourceColumn, destColumn } = action.payload;
      const sourceIds = state[sourceColumn];
      const destIds = state[destColumn];
      const [removed] = sourceIds.splice(from, 1);
      destIds.splice(to, 0, removed);

      saveStateToLocalStorage(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIssues.pending, (state) => {
      state.status = "loading";
      state.issues = {};
    });
    builder.addCase(fetchIssues.fulfilled, (state, { payload }) => {
      if (Object.keys(payload).length > 0) {
        state.issues = payload;
        state.todoIds = Object.keys(payload).map(Number);
        state.inProgressIds = [];
        state.doneIds = [];
        state.status = "success";
      } else {
        state.status = "empty";
      }
    });
    builder.addCase(fetchIssues.rejected, (state) => {
      state.status = "error";
      state.issues = {};
      state.todoIds = [];
      state.inProgressIds = [];
      state.doneIds = [];
    });
  },
});

export interface Issue {
  id?: number;
  title: string;
  number: number;
  user: { login: string };
  comments: number;
}

interface IssueMap {
  [key: number]: Issue;
}

interface IssuesState {
  repoURL: null | string;
  issues: IssueMap;
  todoIds: number[];
  inProgressIds: number[];
  doneIds: number[];
  status: null | string;
}

export const { moveIssue, setSearchParams, getFromLocalStorage } =
  issuesSlice.actions;

export default issuesSlice.reducer;
