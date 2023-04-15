import { useCallback } from "react";
import { IssuesList } from "./IssuesList";
import { moveIssue } from "../../redux/slices/issuesSlice";
import {
  DragDropContext,
  DropResult,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";

export const Content = () => {
  const { issues, status, todoIds, inProgressIds, doneIds } = useSelector(
    (state: RootState) => state.issues
  );
  const { statusRepo } = useSelector((state: RootState) => state.repo);

  const dispatch = useDispatch<AppDispatch>();

  const todoIssues = todoIds.map((id) => issues[id]);
  const inProgressIssues = inProgressIds.map((id) => issues[id]);
  const doneIssues = doneIds.map((id) => issues[id]);

  const onDragEnd: OnDragEndResponder = useCallback((result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (
      source.droppableId !== destination.droppableId ||
      source.index !== destination.index
    ) {
      dispatch(
        moveIssue({
          from: source.index,
          to: destination.index,
          sourceColumn: source.droppableId as
            | "todoIds"
            | "inProgressIds"
            | "doneIds",
          destColumn: destination.droppableId as
            | "todoIds"
            | "inProgressIds"
            | "doneIds",
        })
      );
    }
  }, []);

  return (
    <>
      {status === "error" && statusRepo !== "error" && <div>Try again</div>}
      {status === "empty" && <div>No issues</div>}
      {Object.keys(issues).length > 0 && (
        <div className="issues_container">
          <DragDropContext onDragEnd={onDragEnd}>
            <IssuesList issues={todoIssues} title="To Do" droppable="todoIds" />
            <IssuesList
              issues={inProgressIssues}
              title="in Progress"
              droppable="inProgressIds"
            />
            <IssuesList issues={doneIssues} title="Done" droppable="doneIds" />
          </DragDropContext>
        </div>
      )}
    </>
  );
};
