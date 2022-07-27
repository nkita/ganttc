import React, { useRef,useEffect } from "react";
import { Task,ViewMode } from "gantt-task-react";
import "./input-form.css";
// import { DateConverter } from "../common/modules/date-module"
import { seedDates } from "../custom/date-helper";

type addTaskProps = {
  onAddTodoHandler: (task: Task) => void;
};
export const AddTask: React.FC<addTaskProps> = (props) => {
  const taskName = useRef<HTMLInputElement>(null);
  const taskDateStart = useRef<HTMLInputElement>(null);
  const taskDateEnd = useRef<HTMLInputElement>(null);




  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const currentFullDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`;


  const onAddTodoHandler = (event: React.FormEvent) => {
    const name = taskName.current!.value;
    const dateStart = new Date(taskDateStart.current!.value);
    const dateEnd = new Date(taskDateEnd.current!.value);
    event.preventDefault();

    const task: Task = {
      start: new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate()),
      end: new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate() + 1),
      name: name,
      id: Math.random().toString(),
      progress: 25,
      type: "milestone",
      hideChildren: false,
    };

    props.onAddTodoHandler(task);
  };

  return (
    <div>
      <form onSubmit={onAddTodoHandler}>

        <label htmlFor="task-name">name</label>
        <input type="text" id="task-name" ref={taskName} />

        <label htmlFor="task-date">date start</label>
        <input type="date" id="task-date-start" defaultValue={currentFullDate} ref={taskDateStart} ></input>
        <label htmlFor="task-date">date to</label>
        <input type="date" id="task-date-to" defaultValue={currentFullDate} ref={taskDateEnd} ></input>
        <button type="submit">追加</button>
      </form>
    </div>
  );
};
