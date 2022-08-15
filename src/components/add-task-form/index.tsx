import React from "react";
import { Task } from "gantt-task-react";
import { Form, Button, RadioGroup, Radio, Dropdown, ButtonToolbar } from 'rsuite';
import styles from "./index.module.css";
import commonStyles from "../../common/css/index.module.css";
import Tree from '@rsuite/icons/Tree';
import Page from '@rsuite/icons/Page';


type addTaskProps = {
  onAddTodoHandler: (task: Task) => void;
  tasks?: Task[];
};
export const AddTaskForm: React.FC<addTaskProps> = (props) => {
  const [taskName, setTaskName] = React.useState("");
  const [taskKind, setTaskKind] = React.useState("task");
  const [upperProject, setUpperProject] = React.useState("");
  const [onCtrlKey, setOnCtrlKey] = React.useState(false);
  const [onEnterKey, setOnEnterKey] = React.useState(false);
  // const [projectName, setPrjectName] = React.useState("");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  const onAddTodoHandler = () => {
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Control') {
      setOnCtrlKey(true)
      if (onEnterKey) {
        onAddTodoHandler();
        setOnCtrlKey(false);
        setOnEnterKey(false);
      }
    };
    if (event.key === 'Enter') {
      setOnEnterKey(true);
      if (onCtrlKey) {
        onAddTodoHandler();
        setOnCtrlKey(false);
        setOnEnterKey(false);
      }
    }
  }
  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Control') setOnCtrlKey(false);
    if (event.key === 'Enter') setOnEnterKey(false);
  }

  return (
    <>
      <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} >
        <Form onChange={
          value => {
            setTaskName(value.taskName);
            setTaskKind(value.kind);
          }}
        >
          <Form.Group controlId="kind">
            <Form.ControlLabel>種類</Form.ControlLabel>
            <Form.Control name="kind" inline accepter={RadioGroup} defaultValue={taskKind}>
              <Radio value="project"><Tree /><span className={styles.space} />Project</Radio>
              <Radio value="task"><Page /><span className={styles.space} />Task</Radio>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="project">
            <Form.ControlLabel>プロジェクト</Form.ControlLabel>
            <Dropdown title={(upperProject === "") ? "プロジェクトを選択" : upperProject} disabled={(taskKind === "project") ? true : false}>
              {props.tasks?.map(task => {
                return (task.type === "project") ? <Dropdown.Item key={task.id} eventKey={task.id} onSelect={(key) => { setUpperProject(key) }}>{task.name}</Dropdown.Item> : false;
              })}
            </Dropdown>
            <Form.HelpText tooltip>Taskの場合のみ選択可能</Form.HelpText>
          </Form.Group>
          <Form.Group controlId="name">
            <Form.ControlLabel>名前</Form.ControlLabel>
            <Form.Control name="taskName" className={styles.name} />
          </Form.Group>
          <Form.Group>
            <ButtonToolbar>
              <Button onClick={onAddTodoHandler} appearance="primary" className={styles.register}>登録<span className={commonStyles.space} />Ctrl + Enter</Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      </div>
    </>
  );
};
