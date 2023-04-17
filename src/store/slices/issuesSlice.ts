import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: IssuesState = {
  repoURL: null,
  issues: {
    todoIds: {},
    inProgressIds: {},
    doneIds: {},
  },
  todoIds: [],
  inProgressIds: [],
  doneIds: [],
  status: null,
};

export const fetchIssues = createAsyncThunk(
  "issues/fetchIssues",
  async (repo: string): Promise<IssuesMap> => {
    const [todoIds, inProgressIds, doneIds] = await Promise.all([
      axios.get<Issue[]>(
        `https://api.github.com/repos/${repo}/issues?state=open&sort=created&direction=desc`
      ),
      axios.get<Issue[]>(
        `https://api.github.com/repos/${repo}/issues?state=open&assignee=*`
      ),
      axios.get<Issue[]>(
        `https://api.github.com/repos/${repo}/issues?state=closed`
      ),
    ]);

    const issues = {
      todoIds: todoIds.data.reduce((acc, issue) => {
        if (issue.id) {
          acc[issue.id] = issue;
        }
        return acc;
      }, {} as IssueMap),
      inProgressIds: inProgressIds.data.reduce((acc, issue) => {
        if (issue.id) {
          acc[issue.id] = issue;
        }
        return acc;
      }, {} as IssueMap),
      doneIds: doneIds.data.reduce((acc, issue) => {
        if (issue.id) {
          acc[issue.id] = issue;
        }
        return acc;
      }, {} as IssueMap),
    };

    console.log("fetch", issues);

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

      const removedIssue = state.issues[sourceColumn][removed];
      delete state.issues[sourceColumn][removed];
      state.issues[destColumn][removed] = removedIssue;

      saveStateToLocalStorage(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIssues.pending, (state) => {
      state.status = "loading";
      state.issues = { todoIds: {}, inProgressIds: {}, doneIds: {} };
      state.todoIds = [];
      state.inProgressIds = [];
      state.doneIds = [];
    });
    builder.addCase(fetchIssues.fulfilled, (state, { payload }) => {
      console.log("fulfilled", payload);

      if (
        Object.keys(payload.doneIds).length > 0 ||
        Object.keys(payload.inProgressIds).length > 0 ||
        Object.keys(payload.todoIds).length > 0
      ) {
        state.issues = payload;
        state.todoIds = Object.keys(payload.todoIds).map(Number);
        state.inProgressIds = Object.keys(payload.inProgressIds).map(Number);
        state.doneIds = Object.keys(payload.doneIds).map(Number);
        state.status = "success";
      } else {
        state.status = "empty";
      }
    });
    builder.addCase(fetchIssues.rejected, (state) => {
      console.log("case error");
      state.status = "error";
      state.issues = { todoIds: {}, inProgressIds: {}, doneIds: {} };
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
  created_at: string;
}

interface IssueMap {
  [key: number]: Issue;
}

interface IssuesMap {
  todoIds: IssueMap;
  inProgressIds: IssueMap;
  doneIds: IssueMap;
}

interface IssuesState {
  repoURL: null | string;
  issues: IssuesMap;
  todoIds: number[];
  inProgressIds: number[];
  doneIds: number[];
  status: null | string;
}

export const { moveIssue, setSearchParams, getFromLocalStorage } =
  issuesSlice.actions;

export default issuesSlice.reducer;
