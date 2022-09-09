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
    handleModalClose: () => void;
}> = ({
    task,
    tasks,
    handleEditTask,
    handleModalClose,
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
        const currentDate = new Date();
        const onAddTodoHandler = () => {
            if (formValue.taskName && formValue.taskName !== null) {
                task.name = formValue.taskName;
            }
            if (formValue.dateRangePicker && formValue.dateRangePicker !== null) {
                task.start = formValue.dateRangePicker[0];
                task.end = formValue.dateRangePicker[1]
            }
            task.updateDate = currentDate;

            handleEditTask(task);
            handleModalClose();
        };
        return (
            <>
                <Form onChange={value => {
                    setFormValue(value);
                }}
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
                                    <Button onClick={() => handleModalClose()} appearance="default" className={styles.register}>キャンセル</Button>
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

