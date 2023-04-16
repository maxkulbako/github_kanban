import { useSelector } from "react-redux";
import { RootState } from "./store";

import "./App.css";

import { SearchBar, BaseRepoData, Content } from "./components";

function App() {
  const { status } = useSelector((state: RootState) => state.issues);
  const { statusRepo } = useSelector((state: RootState) => state.repo);

  return (
    <div className="App">
      <SearchBar />
      <BaseRepoData />
      <Content />
      {status && statusRepo === "loading" && <div className="fetching" />}
    </div>
  );
}

export default App;
