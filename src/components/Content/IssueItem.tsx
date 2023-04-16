import { Issue } from "../../redux/slices/issuesSlice";
import { Card } from "antd";

export const IssueItem = ({
  title,
  number,
  user,
  comments,
  created_at,
}: Issue) => {
  function getDaysAgo(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();

    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "opened today";
    } else if (diffDays === 1) {
      return "opened yesterday";
    } else {
      return `opened ${diffDays} days ago`;
    }
  }

  return (
    <Card size="small" title={title} bordered={false} style={{ width: 230 }}>
      <p>{`#${number} ${getDaysAgo(created_at)}`}</p>
      <p>{`${user.login} | Comments: ${comments}`}</p>
    </Card>
  );
};
