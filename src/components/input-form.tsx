import React, { useRef } from "react";
import { Task } from "gantt-task-react";
import "./input-form.css";
// import { DateConverter } from "../common/modules/date-module"

type addTaskProps = {
  onAddTodoHandler: (task: Task) => void;
};
export const AddTask: React.FC<addTaskProps> = (props) => {
  const taskName = useRef<HTMLInputElement>(null);
  const taskDateBegin = useRef<HTMLInputElement>(null);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const currentFullDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`;

  const onAddTodoHandler = (event: React.FormEvent) => {
    const name = taskName.current!.value;
    const dateBegin = new Date(taskDateBegin.current!.value);
    event.preventDefault();

    const task: Task = {
      start: new Date(dateBegin.getFullYear(), dateBegin.getMonth(), dateBegin.getDate()),
      end: new Date(dateBegin.getFullYear(), dateBegin.getMonth(), dateBegin.getDate() + 1),
      name: name,
      id: Math.random().toString(),
      progress: 25,
      type: "milestone",
      hideChildren: false,
    };

    props.onAddTodoHandler(task);
  };

  return (
    <form onSubmit={onAddTodoHandler}>
      <label htmlFor="task-name">name</label>
      <input type="text" id="task-name" ref={taskName} />

      <label htmlFor="task-date">date</label>
      <input type="date" id="task-date-begin" defaultValue={currentFullDate} ref={taskDateBegin} ></input>
      <button type="submit">追加</button>
    </form>
  );
};
