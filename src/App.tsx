import "./App.css";
import { SearchBar } from "./components/SearchBar/SearchBar";

import { BaseRepoData } from "./components/BaseRepoData/BaseRepoData";
import { Content } from "./components/Content";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

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
