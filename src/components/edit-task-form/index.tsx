import React from "react";
import { Task } from "../../common/types/public-types";
import { Button, Form, Radio, Schema, RadioGroup, InputPicker, DateRangePicker, Row, Col, Stack } from 'rsuite';
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
        const initFormValue: {
            type?: string,
            taskName?: string,
            dateRangePicker?: Date[],
        } = {
            type: task.type,
            taskName: task.name,
            dateRangePicker: [task.start, task.end]
        };
        const [formValue, setFormValue] = React.useState(initFormValue);
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
                type: (formValue.type === "task") ? "task" : "project",
                updateDate: currentDate,
            };

            if (formValue.type === "project") task.hideChildren = false;

            // 追加フォームのリセット
            setTaskName("");
            if (nameRef.current) {
                const ele = nameRef.current!.childNodes[0] as HTMLInputElement;
                ele.value = "";
            }
        };
        return (
            <>
                <Form onChange={value => { setFormValue(value) }}
                    formValue={formValue}
                    model={model}
                >
                    <Form.Group controlId="type">
                        <div className={styles.formLabel}>種類</div>
                        <Form.Control name="type" inline accepter={RadioGroup}>
                            <Radio value="project"><Tree />Project</Radio>
                            <Radio value="task"><Page />Task</Radio>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="project">
                        <div className={styles.formLabel}>プロジェクト</div>
                        <Form.Control name="project" accepter={InputPicker} placeholder={"プロジェクトを選択"} disabled={formValue.type === "project"} data={
                            tasks.filter(t => t.type === "project").map(t => { return { label: t.name, value: t.id } })
                        } />
                        <Form.HelpText tooltip>Taskの場合のみ選択可能</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="taskName">
                        <div className={styles.formLabel}>名前</div>
                        <Form.Control name="taskName" className={styles.name} />
                    </Form.Group>
                    <Form.Group controlId="dateRangePicker" >
                        <div className={styles.formLabel}>期間</div>
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

