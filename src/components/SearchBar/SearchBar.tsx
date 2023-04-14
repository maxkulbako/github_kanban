import { Input } from "antd";

const { Search } = Input;

export const SearchBar = ({ onSearch }: IProps) => {
  return (
    <Search
      placeholder="input search text"
      onSearch={(value: string) => {
        const regex = /(?<=github\.com\/)\S+/;
        let searchParams: string | null = null;
        const matches = value.match(regex);
        if (matches && matches.length > 0) {
          searchParams = matches[0];
        }
        onSearch(searchParams);
      }}
      enterButton
    />
  );
};

interface IProps {
  onSearch: (repo: string | null) => void;
}
