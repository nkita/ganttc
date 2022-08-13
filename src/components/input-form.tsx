import React from "react";
import { Task } from "gantt-task-react";
import { Form, Button } from 'rsuite';

type addTaskProps = {
  onAddTodoHandler: (task: Task) => void;
  isTask: boolean;
  tasks?: Task[];
};

type addProjectProps = {
  tasks: Task[];
  handleSetProject: any;
}

const SelectForm: React.FC<addProjectProps> = (x, handleSetProject) => {
  const projectName = "";
  const options = x.tasks.map((t: any) => {
    if (t.type === "project" && !t.project) {
      return (
        <option key={"addForm" + t.id} value={t.id}>{t.name}</option>
      );
    }
  });
  const setProject = () => {
    handleSetProject(projectName);
  }

  return (
    <select name="projectList" value={projectName} onChange={setProject}>
      <option key="top">指定しない</option>
      {options}
    </select>
  )
}

export const AddTask: React.FC<addTaskProps> = (props) => {
  const [taskName, setTaskName] = React.useState("");
  const [projectName, setPrjectName] = React.useState("");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  // const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
  //   item => ({ label: item, value: item })
  // );
  console.log(projectName);
  const onAddTodoHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(event);
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
      <Form layout="inline" onChange={
        value => {
          setTaskName(value.taskName);
        }}>
        <Form.Group controlId="username-7" >
          {(() => {
            if (props.isTask) {
              return (
                <div>
                  <Form.ControlLabel>プロジェクト</Form.ControlLabel>
                  <SelectForm tasks={props.tasks!} handleSetProject={setPrjectName} />
                </div>
              );
            }
          })()}
          <Form.ControlLabel>Name</Form.ControlLabel>
          <Form.Control name="taskName" style={{ width: 160 }} />
        </Form.Group>
        <Button onClick={onAddTodoHandler}>登録</Button>
      </Form>
    </>
  );
};
