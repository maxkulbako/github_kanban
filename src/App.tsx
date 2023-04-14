import React from "react";
import "./App.css";
import { RootState } from "./redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchIssues } from "./redux/slices/githubReposSlice";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { IssuesList } from "./components/Content/IssuesList";
import { AppDispatch } from "./redux/store";

function App() {
  const { repos, status } = useSelector((state: RootState) => state.repos);
  const dispatch = useDispatch<AppDispatch>();

  console.log(repos);

  const handleFetchRepos = (repo: string) => {
    dispatch(fetchIssues(repo));
  };

  return (
    <div className="App">
      <SearchBar onSearch={handleFetchRepos} />
      {status === "loading" && <div>Загрузка...</div>}
      {status === "error" && <div>Try again</div>}
      {repos.length > 0 && (
        <div className="issues_container">
          <IssuesList issues={repos} title="To Do" />
          <IssuesList issues={repos} title="in Progress" />
          <IssuesList issues={repos} title="Done" />
        </div>
      )}
    </div>
  );
}

export default App;
