import React from "react";
import { Task } from "../../common/types/public-types";
// import { Form, Button, RadioGroup, Radio, Dropdown, ButtonToolbar, DateRangePicker } from 'rsuite';
import { Form, Button, RadioGroup, Radio, Dropdown, ButtonToolbar, Schema } from 'rsuite';
import { getLayerOrder, getLayerOrderToDisplayOrder } from "../../helper";

import styles from "./index.module.css";
import Tree from '@rsuite/icons/Tree';
import Page from '@rsuite/icons/Page';


type addTaskProps = {
  onAddTodoHandler: (task: Task) => void;
  tasks?: Task[];
  childLimit?: Number;
};
export const AddTaskForm: React.FC<addTaskProps> = (props) => {
  const [taskName, setTaskName] = React.useState("");
  const [taskKind, setTaskKind] = React.useState("task");
  const [upperProject, setUpperProject] = React.useState<Task>();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const nameRef = React.useRef<HTMLDivElement>(null);

  const model = Schema.Model({
    taskName: Schema.Types.StringType().isRequired('必須入力です。')
  })

  // 各階層の最大値を取得

  const getMaxLayerOrder = (upperProject: string = "") => {
    let maxNumber = 1;
    props.tasks?.map(task => {
      console.log(upperProject, !upperProject);
      if (!upperProject) {
        if (task.project === undefined) {
          maxNumber = (maxNumber < getLayerOrder(0, task.displayOrder!)) ? getLayerOrder(0, task.displayOrder!) : maxNumber;
          // console.log("!upperProject getLayerOrder(0, task.displayOrder!)=", getLayerOrder(0, task.displayOrder!));
        }
      } else {
        if (task.project === upperProject) {
          maxNumber = (maxNumber < getLayerOrder(task.layer!, task.displayOrder!)) ? getLayerOrder(task.layer!, task.displayOrder!) : maxNumber;
          // console.log("upperProject getLayerOrder(task.layer, task.displayOrder!)=", getLayerOrder(task.layer!, task.displayOrder!));
        }
      }
      return null;
    })
    return maxNumber;
  }

  const onAddTodoHandler = () => {
    if (taskName === "") return;

    const task: Task = {
      start: new Date(currentYear, currentMonth, currentDay, 0, 0),
      end: new Date(currentYear, currentMonth, currentDay, 23, 59),
      name: taskName,
      id: Math.random().toString(),
      progress: 0,
      type: (taskKind === "task") ? "task" : "project",

    };

    if (taskKind === "project") {
      task.hideChildren = false;
    }
    if (upperProject !== undefined) {
      task.project = upperProject.id;
      task.layer = upperProject.layer! + 1;

      //並び順セット
      task.displayOrder = getLayerOrderToDisplayOrder(
        task.layer,
        getMaxLayerOrder(task.project) + 1,
        upperProject.displayOrder
      );

    } else {
      task.layer = 0;
      //並び順セット
      task.displayOrder = getLayerOrderToDisplayOrder(
        task.layer,
        getMaxLayerOrder() + 1,
        0
      );
    }



    // 追加フォームのリセット
    setTaskName("");
    if (nameRef.current) {
      const ele = nameRef.current!.childNodes[0] as HTMLInputElement;
      ele.value = "";
    }
    props.onAddTodoHandler(task);
  };

  return (
    <>
      <div>
        <Form onChange={
          value => {
            setTaskName(value.taskName);
            setTaskKind(value.kind);
          }}
          formDefaultValue={
            { kind: "task", taskName: "" }
          }
          model={model}
        >
          <Form.Group controlId="kind">
            <Form.ControlLabel>種類</Form.ControlLabel>
            <Form.Control name="kind" inline accepter={RadioGroup}>
              <Radio value="project"><Tree /><span className={styles.space} />Project</Radio>
              <Radio value="task"><Page /><span className={styles.space} />Task</Radio>
            </Form.Control>
          </Form.Group>
          {/* <Form.Group controlId="date" >
            <Form.ControlLabel>開始/終了</Form.ControlLabel>
            <DateRangePicker />
          </Form.Group> */}
          <Form.Group controlId="project">
            <Form.ControlLabel>プロジェクト</Form.ControlLabel>
            <Dropdown title={(upperProject === undefined) ? "プロジェクトを選択" : upperProject.name} disabled={(taskKind === "project") ? true : false}>
              {props.tasks?.map(task => {
                return (task.type === "project") ? <Dropdown.Item key={task.id} eventKey={task} onSelect={(key) => { setUpperProject(key) }}>{task.name}</Dropdown.Item> : false;
              })}
            </Dropdown>
            <Form.HelpText tooltip>Taskの場合のみ選択可能</Form.HelpText>
          </Form.Group>
          <Form.Group controlId="taskName">
            <Form.ControlLabel>名前</Form.ControlLabel>
            <Form.Control name="taskName" className={styles.name} ref={nameRef} />
          </Form.Group>
          <Form.Group>
            <ButtonToolbar>
              <Button type="submit" onClick={onAddTodoHandler} appearance="primary" className={styles.register}>登録</Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      </div>
    </>
  );
};
