import { Input } from "antd";
import {
  setSearchParams,
  getFromLocalStorage,
} from "../../redux/slices/githubReposSlice";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";

const { Search } = Input;

export const SearchBar = ({ onSearch }: IProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = (value: string) => {
    const regex = /(?<=github\.com\/)\S+/;
    let searchParams: string = "";

    const matches = value.match(regex);
    if (matches && matches.length > 0) {
      searchParams = matches[0];
    }

    if (localStorage.getItem(value)) {
      dispatch(setSearchParams(value));
      dispatch(getFromLocalStorage(value));
    } else {
      onSearch(searchParams);
      dispatch(setSearchParams(value));
    }
  };

  return (
    <Search placeholder="Enter repo URL" onSearch={handleSearch} enterButton />
  );
};

interface IProps {
  onSearch: (repo: string) => void;
}
