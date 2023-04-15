import { IssueItem } from "./IssueItem";
import { Issue } from "../../redux/slices/issuesSlice";
import { Droppable, Draggable, DroppableProvided } from "react-beautiful-dnd";

export const IssuesList = ({ issues, title, droppable }: Props) => {
  return (
    <div className="issues_wrapper">
      <span>{title}</span>
      <Droppable droppableId={droppable} type="PERSON">
        {(provided: DroppableProvided): JSX.Element => (
          <div
            className="todo_container"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {issues &&
              issues.map((repo, index) => (
                <Draggable
                  key={repo.id}
                  draggableId={repo.id ? repo.id.toString() : ""}
                  index={index}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <IssueItem
                        number={repo.number}
                        title={repo.title}
                        user={repo.user}
                        comments={repo.comments}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

interface Props {
  issues: Issue[];
  title: string;
  droppable: string;
}
