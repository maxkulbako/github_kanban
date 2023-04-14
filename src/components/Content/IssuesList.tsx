import { IssueItem } from "./IssueItem";
import { Repo } from "../../redux/slices/githubReposSlice";

export const IssuesList = ({ issues, title }: Props) => {
  return (
    <div className="issues_wrapper">
      <span>{title}</span>
      <div className="todo_container">
        {issues.map((repo) => (
          <IssueItem
            number={repo.number}
            key={repo.id}
            title={repo.title}
            user={repo.user}
            comments={repo.comments}
          />
        ))}
      </div>
    </div>
  );
};

interface Props {
  issues: Repo[];
  title: string;
}
