import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  DragDropContext,
  type DropResult,
  type OnDragEndResponder,
} from "react-beautiful-dnd";
import { type AppDispatch, type RootState } from "../../store";
import { IssuesList } from "./IssuesList";
import { moveIssue } from "../../store/slices/issuesSlice";

export const Content = (): JSX.Element => {
  const { issues, status, todoIds, inProgressIds, doneIds } = useSelector(
    (state: RootState) => state.issues
  );
  const { statusRepo } = useSelector((state: RootState) => state.repo);

  console.log(issues);
  console.log(todoIds);

  const dispatch = useDispatch<AppDispatch>();

  const todoIssues = todoIds.map((id) => issues.todoIds[id]);
  const inProgressIssues = inProgressIds.map((id) => issues.inProgressIds[id]);
  const doneIssues = doneIds.map((id) => issues.doneIds[id]);

  const onDragEnd: OnDragEndResponder = useCallback((result: DropResult) => {
    const { source, destination } = result;
    if (destination == null) {
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
      {status === "error" && statusRepo !== "error" && (
        <div className="no_repo">
          Could not find repositories. Please check link and try again`
        </div>
      )}
      {status === "empty" && <div className="no_issues">No issues...</div>}
      {(Object.keys(issues.doneIds).length > 0 ||
        Object.keys(issues.inProgressIds).length > 0 ||
        Object.keys(issues.todoIds).length > 0) && (
        <div className="kanban_container">
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
