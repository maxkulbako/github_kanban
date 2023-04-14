import React, { useCallback } from "react";
import "./App.css";
import { RootState } from "./redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchIssues, moveIssue } from "./redux/slices/githubReposSlice";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { IssuesList } from "./components/Content/IssuesList";
import { AppDispatch } from "./redux/store";
import {
  DragDropContext,
  DropResult,
  OnDragEndResponder,
} from "react-beautiful-dnd";

function App() {
  const { issues, status, todoIds, inProgressIds, doneIds } = useSelector(
    (state: RootState) => state.issues
  );
  const dispatch = useDispatch<AppDispatch>();

  const todoIssues = todoIds.map((id) => issues[id]);
  const inProgressIssues = inProgressIds.map((id) => issues[id]);
  const doneIssues = doneIds.map((id) => issues[id]);

  console.log(issues);

  const onDragEnd: OnDragEndResponder = useCallback((result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (
      source.droppableId !== destination.droppableId ||
      source.index !== destination.index
    ) {
      dispatch(
        moveIssue({
          from: source.index,
          to: destination.index,
          sourceColumn: source.droppableId as
            | "todoIds"
            | "inProgressIds"
            | "doneIds",
          destColumn: destination.droppableId as
            | "todoIds"
            | "inProgressIds"
            | "doneIds",
        })
      );
    }
  }, []);

  const handleFetchRepos = (repo: string) => {
    dispatch(fetchIssues(repo));
  };

  return (
    <div className="App">
      <SearchBar onSearch={handleFetchRepos} />
      {status === "loading" && <div>Загрузка...</div>}
      {status === "error" && <div>Try again</div>}
      {Object.keys(issues).length > 0 && (
        <div className="issues_container">
          <DragDropContext onDragEnd={onDragEnd}>
            <IssuesList issues={todoIssues} title="To Do" droppable="todoIds" />
            <IssuesList
              issues={inProgressIssues}
              title="in Progress"
              droppable="inProgressIds"
            />
            <IssuesList issues={doneIssues} title="Done" droppable="doneIds" />
          </DragDropContext>
        </div>
      )}
    </div>
  );
}

export default App;
