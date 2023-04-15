import { useCallback } from "react";
import "./App.css";
import { RootState } from "./redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchIssues, moveIssue } from "./redux/slices/issuesSlice";
import { fetchRepo } from "./redux/slices/repoSlice";
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
  const { repoURL, name, stars, statusRepo } = useSelector(
    (state: RootState) => state.repo
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

  const handleFetchIssues = (repo: string) => {
    dispatch(fetchIssues(repo));
  };

  const handleFetchRepo = (repo: string) => {
    dispatch(fetchRepo(repo));
  };

  return (
    <div className="App">
      <SearchBar onSearch={handleFetchIssues} getRepo={handleFetchRepo} />
      {statusRepo === "success" && (
        <div>
          <a href={repoURL}>{name}</a>
          <p>{stars}</p>
        </div>
      )}
      {status && statusRepo === "loading" && <div>Загрузка...</div>}
      {status === "error" && <div>Try again</div>}
      {status === "empty" && <div>No issues</div>}
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
