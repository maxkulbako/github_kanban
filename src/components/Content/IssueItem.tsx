import { Repo } from "../../redux/slices/githubReposSlice";
export const IssueItem = ({ title, number, user, comments }: Repo) => {
  return (
    <div>
      <p>{title}</p>
      <p>{number}</p>
      <p>{user.login}</p>
      <p>{comments}</p>
    </div>
  );
};

// export interface Issue {
//   key?: number;
//   title: string;
//   number: number;
//   user: { login: string };
//   comments: number;
// }
