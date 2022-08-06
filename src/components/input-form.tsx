import React from "react";
import { Task } from "gantt-task-react";
import { Form, Button } from 'rsuite';

type addTaskProps = {
  onAddTodoHandler: (task: Task) => void;
};
export const AddTask: React.FC<addTaskProps> = (props) => {
  const [taskName, setTaskName] = React.useState("");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  const onAddTodoHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const task: Task = {
      start: new Date(currentYear, currentMonth, currentDay, 0, 0),
      end: new Date(currentYear, currentMonth, currentDay, 23, 59),
      name: taskName,
      id: Math.random().toString(),
      progress: 0,
      type: "task",
      hideChildren: false,
    };
    props.onAddTodoHandler(task);
  };

  return (
    <Form layout="inline" onChange={
      value => {
        setTaskName(value.taskName);
      }}>
      <Form.Group controlId="username-7" >
        <Form.ControlLabel>Name</Form.ControlLabel>
        <Form.Control name="taskName" style={{ width: 160 }} />
      </Form.Group>
      <Button onClick={onAddTodoHandler}>登録</Button>
    </Form>
  );
};
