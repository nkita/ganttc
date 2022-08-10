import React, { useMemo, useState } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../common/types/public-types"
import { Popover, Whisper, Button, Form, InputNumber } from 'rsuite';
import Edit from '@rsuite/icons/Edit';
import Trash from '@rsuite/icons/Trash';
import Tree from '@rsuite/icons/Tree';
import Page from '@rsuite/icons/Page';
import 'rsuite/dist/rsuite.min.css';

const localeDateStringCache: { [key: string]: string } = {};
const toLocaleDateStringFactory =
    (locale: string) =>
        (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
            const key = date.toString();
            let lds = localeDateStringCache[key];
            if (!lds) {
                //　多言語対応
                // lds = date.toLocaleDateString(locale, dateTimeOptions);
                // 日本語用
                lds = date.getMonth() + 1 + "/" + date.getDate();
                localeDateStringCache[key] = lds;
            }
            return lds;
        };
const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
};

// 日付の横幅
const rowWidthLong = 200;

export const TaskListColumn: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
}> = ({
    rowHeight,
    rowWidth,
    tasks,
    fontFamily,
    fontSize,
    locale,
    setSelectedTask,
    onExpanderClick,
}) => {
        const [taskId, setTaskId] = React.useState("");
        const progressRef = React.useRef(null);
        const taskName = React.useRef(null);
        const handleTaskNameChange = (e: React.ChangeEvent<HTMLSelectElement>, t: Task) => {
            t.progress = Number(e.target.value);
            setSelectedTask(t.id);
        }
        const handleProgressChange = (e: React.ChangeEvent<HTMLSelectElement>, t: Task) => {
            t.progress = Number(e.target.value);
            setSelectedTask(t.id);
        }
        const toLocaleDateString = useMemo(
            () => toLocaleDateStringFactory(locale),
            [locale]
        );

        const modifyEvent = (event: React.FormEvent) => {
            event.preventDefault();
            console.log(event, taskId);

        }

        const speaker = (task: Task) => (
            <Popover title={task.name}>
                <Form layout="inline" onChange={
                    value => {
                        console.log(value, "aaaaaaaa");
                        setTaskId(value.taskId)
                    }
                }>
                    <Form.Group controlId="username-7">
                        <Form.ControlLabel>taskid</Form.ControlLabel>
                        <Form.Control name="taskId" style={{ width: 160 }} />
                    </Form.Group>
                    <Button onClick={modifyEvent} >登録</Button>
                </Form>
            </Popover>
        );
        return (
            <>
                <div
                    className={styles.taskListWrapper}
                    style={{
                        fontFamily: fontFamily,
                        fontSize: fontSize,
                    }}
                >

                    {tasks.map(t => {
                        let expanderSymbol = "";
                        if (t.hideChildren === false) {
                            expanderSymbol = "▼";
                        } else if (t.hideChildren === true) {
                            expanderSymbol = "▶";
                        }
                        return (
                            <div
                                className={styles.taskListTableRow}
                                style={{ height: rowHeight }}
                                key={`${t.id}row`}
                            >
                                <div
                                    className={styles.taskListCell}
                                    style={{
                                        minWidth: rowWidthLong,
                                        maxWidth: rowWidthLong,
                                    }}
                                    title={t.name}
                                >
                                    <div className={styles.taskListNameWrapper}>
                                        <div
                                            className={
                                                expanderSymbol
                                                    ? styles.taskListExpander
                                                    : styles.taskListEmptyExpander
                                            }
                                            onClick={() => onExpanderClick(t)}
                                        >
                                            {expanderSymbol}
                                        </div>

                                        <div>
                                            {(t.hideChildren === undefined) ? <Page /> : <Tree />}
                                            <span style={{ paddingRight: 10 }} />
                                            <input type="text" onChange={e => console.log("onChange")} defaultValue={t.name} />

                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={styles.taskListCell}
                                    style={{
                                        minWidth: 50,
                                        maxWidth: 50,
                                    }}
                                >
                                    <div className={styles.taskListNameWrapper}>
                                        <div>
                                            <Whisper placement="rightStart" trigger="click" controlId="control-id-click" speaker={speaker(t)}>
                                                <Edit style={{ fontSize: "1em", cursor: "pointer" }} />
                                            </Whisper>
                                            <span style={{ paddingRight: 10 }}></span>
                                            <Whisper placement="rightStart" trigger="click" controlId="control-id-click" speaker={speaker(t)}>
                                                <Trash style={{ fontSize: "1em", color: "red", cursor: "pointer" }} />
                                            </Whisper>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={styles.taskListCell}
                                    style={{
                                        minWidth: rowWidth,
                                        maxWidth: rowWidth,
                                        textAlign: "center",
                                    }}
                                >
                                    <span>{toLocaleDateString(t.start, dateTimeOptions)}</span>
                                    -
                                    <span>{toLocaleDateString(t.end, dateTimeOptions)}</span>
                                </div>
                                <div
                                    className={styles.taskListCell}
                                    style={{
                                        minWidth: rowWidth,
                                        maxWidth: rowWidth,
                                        textAlign: "center",
                                    }}
                                >

                                    <select name="progress" ref={progressRef} onChange={(e) => handleProgressChange(e, t)} value={t.progress}>
                                        <option value={0}>0%</option>
                                        <option value={25}>25%</option>
                                        <option value={50}>50%</option>
                                        <option value={75}>75%</option>
                                        <option value={100}>100%</option>
                                    </select>
                                </div>
                            </div>
                        );
                    })}
                </div >
            </>
        );
    };