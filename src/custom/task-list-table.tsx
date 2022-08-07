import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../common/types/public-types"
import { Popover, Whisper, Button, Form, IconButton } from 'rsuite';
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

const speaker = (task: Task, setSelectedTask: Function) => (
    <Popover title={task.name}>
        <Form layout="inline" >
            <Form.Group controlId="username-7">
                <Form.ControlLabel>Username</Form.ControlLabel>
                <Form.Control name="username" style={{ width: 160 }} />
                <Form.HelpText tooltip>Required</Form.HelpText>
            </Form.Group>

            <Form.Group controlId="password-7">
                <Form.ControlLabel>Password</Form.ControlLabel>
                <Form.Control name="password" type="password" autoComplete="off" style={{ width: 160 }} />
            </Form.Group>

            <Button>Login</Button>
        </Form>
    </Popover>
);

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
        const toLocaleDateString = useMemo(
            () => toLocaleDateStringFactory(locale),
            [locale]
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
                        console.log(t.hideChildren === undefined);

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
                                            <span>{t.name}</span>
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
                                            <Whisper placement="rightStart" trigger="click" controlId="control-id-click" speaker={speaker(t, setSelectedTask)}>
                                                <Edit style={{ fontSize: "1em", cursor: "pointer" }} />
                                            </Whisper>
                                            <span style={{ paddingRight: 10 }}></span>
                                            <Whisper placement="rightStart" trigger="click" controlId="control-id-click" speaker={speaker(t, setSelectedTask)}>
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
                                    <select name="progress">
                                        <option defaultValue={0}>0%</option>
                                        <option defaultValue={25}>25%</option>
                                        <option defaultValue={50}>50%</option>
                                        <option defaultValue={75}>75%</option>
                                        <option defaultValue={100}>100%</option>
                                    </select>
                                </div>
                            </div>
                        );
                    })}
                </div >
            </>
        );
    };