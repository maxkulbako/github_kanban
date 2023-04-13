import React from "react";
import "./App.css";
import { RootState } from "./redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepos } from "./redux/slices/githubReposSlice";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { IssueItem } from "./components/Content/IssueItem";

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
      {currentState.repos.map((repo) => (
        <IssueItem
          number={repo.number}
          key={repo.id}
          title={repo.title}
          user={repo.user}
          comments={repo.comments}
        />
      ))}
    </div>
  );
}

export default App;
