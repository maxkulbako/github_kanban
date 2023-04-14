import React from "react";
import "./App.css";
import { RootState } from "./redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepos } from "./redux/slices/githubReposSlice";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { IssuesList } from "./components/Content/IssuesList";
import { current } from "@reduxjs/toolkit";

function App() {
  const currentState = useSelector((state: RootState) => state.repos);
  const dispatch = useDispatch();

  console.log(currentState);

  const handleFetchRepos = () => {
    dispatch(fetchRepos());
  };

  return (
    <div className="App">
      <SearchBar />
      <button onClick={handleFetchRepos}>Загрузить репозитории</button>
      {currentState.loading && <div>Загрузка...</div>}
      {currentState.error && <div>{currentState.error}</div>}
      {currentState.repos.length > 0 && (
        <div className="issues_container">
          <IssuesList issues={currentState.repos} title="To Do" />
          <IssuesList issues={currentState.repos} title="in Progress" />
          <IssuesList issues={currentState.repos} title="Done" />
        </div>
      )}
    </div>
  );
}

export default App;
