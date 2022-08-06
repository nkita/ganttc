import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../common/types/public-types"
import { Popover, Whisper, Button, Form } from 'rsuite';
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
const rowWidthShort = 100;
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
                                        <Whisper placement="rightStart" trigger="click" controlId="control-id-click" speaker={speaker(t, setSelectedTask)}>
                                            <span>{t.name}</span>
                                        </Whisper>
                                    </div>

                                </div>
                            </div>
                            <div
                                className={styles.taskListCell}
                                style={{
                                    minWidth: rowWidthShort,
                                    maxWidth: rowWidthShort,
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
                                    minWidth: rowWidthShort,
                                    maxWidth: rowWidthShort,
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
        );
    };