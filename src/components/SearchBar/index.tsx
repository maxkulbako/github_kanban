import { Input } from "antd";
import { useDispatch } from "react-redux";

import {
  setSearchParams,
  getFromLocalStorage,
} from "../../store/slices/issuesSlice";
import { fetchIssues } from "../../store/slices/issuesSlice";
import { fetchRepo } from "../../store/slices/repoSlice";
import { AppDispatch } from "../../store";

const { Search } = Input;

export const SearchBar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = (value: string) => {
    const regex = /(?<=github\.com\/)\S+/;
    let searchParams: string = "";

    const matches = value.match(regex);
    if (matches && matches.length > 0) {
      searchParams = matches[0];
    }

    dispatch(fetchRepo(searchParams));

    if (localStorage.getItem(value)) {
      dispatch(setSearchParams(value));
      dispatch(getFromLocalStorage(value));
    } else {
      console.log("fetch");
      dispatch(fetchIssues(searchParams));
      dispatch(setSearchParams(value));
    }
  };

  return (
    <Search
      placeholder="Enter repo URL"
      onSearch={handleSearch}
      enterButton={"Load"}
    />
  );
};
