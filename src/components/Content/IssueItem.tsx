import { Issue } from "../../redux/slices/githubReposSlice";
import { Card } from "antd";

export const IssueItem = ({ title, number, user, comments }: Issue) => {
  return (
    <Card size="small" title={title} bordered={false} style={{ width: 230 }}>
      <p>{`# ${number}`}</p>
      <p>{`${user.login} | Comments: ${comments}`}</p>
    </Card>
  );
};
