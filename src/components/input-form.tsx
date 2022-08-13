import React from "react";
import { Task } from "gantt-task-react";
import { Form, Button, RadioGroup, Radio, Dropdown, ButtonToolbar } from 'rsuite';
import styles from "./input-form.module.css";
import Tree from '@rsuite/icons/Tree';
import Page from '@rsuite/icons/Page';


type addTaskProps = {
  onAddTodoHandler: (task: Task) => void;
  tasks?: Task[];
};
export const AddTask: React.FC<addTaskProps> = (props) => {
  const [taskName, setTaskName] = React.useState("");
  // const [projectName, setPrjectName] = React.useState("");
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
    <>
      <Form onChange={
        value => {
          setTaskName(value.taskName);
        }}
        formValue={
          {radio:"task"}
        }
      >
        <Form.Group controlId="kind">
          <Form.ControlLabel>種類</Form.ControlLabel>
          <Form.Control name="radio" inline accepter={RadioGroup}>
            <Radio value="project"><Tree /><span className={styles.space} />Project</Radio>
            <Radio value="task"><Page /><span className={styles.space} />Task</Radio>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="project">
          <Form.ControlLabel>プロジェクト</Form.ControlLabel>
          <Form.Control name="radio" accepter={Dropdown} title={"上位のプロジェクトを指定"} disabled>
            {props.tasks?.map(task => {
              return (task.type === "project") ? <Dropdown.Item key={task.id}>{task.name}</Dropdown.Item> : false;
            })}
          </Form.Control>
          <Form.HelpText tooltip>Taskの場合のみ</Form.HelpText>
        </Form.Group>
        <Form.Group controlId="name">
          <Form.ControlLabel>名前</Form.ControlLabel>
          <Form.Control name="taskName" style={{ width: "350px" }} />
        </Form.Group>
        <Form.Group>
          <ButtonToolbar>
            <Button appearance="ghost" color="red">キャンセル</Button>
            <Button onClick={onAddTodoHandler} appearance="primary" style={{ width: "30%" }}>登録</Button>
          </ButtonToolbar>
        </Form.Group>
      </Form>
    </>
  );
};
