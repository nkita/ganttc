import React, { useRef } from "react";
import { Task } from "gantt-task-react";
import "./input-form.css";


type addTaskProps = {
  onAddTodoHandler: (task: Task) => void;
};
export const AddTask: React.FC<addTaskProps> = (props) => {
  const taskName = useRef<HTMLInputElement>(null);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  const onAddTodoHandler = (event: React.FormEvent) => {
    const name = taskName.current!.value;
    event.preventDefault();

    const task: Task = {
      start: new Date(currentYear, currentMonth, currentDay, 0, 0),
      end: new Date(currentYear, currentMonth, currentDay, 23, 59),
      name: name,
      id: Math.random().toString(),
      progress: 0,
      type: "task",
      hideChildren: false,
    };

    props.onAddTodoHandler(task);
  };

  return (
    <div className="inputFormWrapper">
      <form onSubmit={onAddTodoHandler}>

        <label htmlFor="task-name">name</label>
        <input type="text" id="task-name" ref={taskName} />
        <button type="submit">追加</button>
      </form>
    </div>
  );
};
