import React from "react";
import { Task } from "../../common/types/public-types";
import { Button, Form, Radio, Schema, RadioGroup, Dropdown, DateRangePicker, Row, Col, Stack } from 'rsuite';
import Tree from '@rsuite/icons/Tree';
import Page from '@rsuite/icons/Page';
import styles from "./index.module.css";


export const EditTaskForm: React.FC<{
    task: Task;
    tasks: Task[];
    handleEditTask: (task: Task) => void;
}> = ({
    task,
    tasks,
    handleEditTask,
}) => {
        const [taskKind, setTaskKind] = React.useState("task");
        const [upperProject, setUpperProject] = React.useState<Task>();
        const model = Schema.Model({
            taskName: Schema.Types.StringType().isRequired('必須入力です。')
        })
        const [taskName, setTaskName] = React.useState("");

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();
        const nameRef = React.useRef<HTMLDivElement>(null);
        const onAddTodoHandler = () => {
            if (taskName === "") return;
            const task: Task = {
                start: new Date(currentYear, currentMonth, currentDay, 0, 0),
                end: new Date(currentYear, currentMonth, currentDay, 23, 59),
                name: taskName,
                id: Math.random().toString(),
                progress: 0,
                type: (taskKind === "task") ? "task" : "project",
                updateDate: currentDate,
            };

            if (taskKind === "project") task.hideChildren = false;
            if (upperProject !== undefined) task.project = upperProject.id;

            // 追加フォームのリセット
            setTaskName("");
            if (nameRef.current) {
                const ele = nameRef.current!.childNodes[0] as HTMLInputElement;
                ele.value = "";
            }
        };

        return (
            <>
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
                        <Form.Control name="kind" inline accepter={RadioGroup} onChange={
                            (e: any) => {
                                setUpperProject(undefined);
                            }
                        } >
                            <Radio value="project"><Tree /><span className={styles.space} />Project</Radio>
                            <Radio value="task"><Page /><span className={styles.space} />Task</Radio>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="project">
                        <Form.ControlLabel>プロジェクト</Form.ControlLabel>

                        <Dropdown title={(upperProject === undefined) ? "プロジェクトを選択" : upperProject.name} disabled={(taskKind === "project") ? true : false}>
                            {tasks?.map(t => {
                                return (t.type === "project") ? <Dropdown.Item key={t.id} eventKey={t} onSelect={(key) => { setUpperProject(key) }}>{t.name}</Dropdown.Item> : false;
                            })}
                        </Dropdown>
                        <Form.HelpText tooltip>Taskの場合のみ選択可能</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="taskName">
                        <Form.ControlLabel>名前</Form.ControlLabel>
                        <Form.Control name="taskName" className={styles.name} ref={nameRef} />
                    </Form.Group>
                    <Form.Group controlId="dateRangePicker">
                        <Form.ControlLabel>期間</Form.ControlLabel>
                        <Form.Control name="dateRangePicker" accepter={DateRangePicker} />
                    </Form.Group>
                    <Form.Group >
                        <Row style={{ margin: "0px" }}>
                            <Col xs={12} xsPush={12}>
                                <Stack spacing={12}>
                                    <Button type="submit" onClick={onAddTodoHandler} appearance="primary" className={styles.register}>更新</Button>
                                    <Button onClick={onAddTodoHandler} appearance="default" className={styles.register}>キャンセル</Button>
                                </Stack>
                            </Col>
                            <Col xs={6} xsPull={12}>
                                <Button color="red" onClick={onAddTodoHandler} appearance="primary" className={styles.register}>削除</Button>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            </>
        );
    }

