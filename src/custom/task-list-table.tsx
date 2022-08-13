import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../common/types/public-types"
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
        const progressRef = React.useRef(null);
        const handleTaskDelete = (e: React.MouseEvent<HTMLElement>, t: Task) => {
            t.clickOnDeleteButtom = true;
            setSelectedTask(t.id);
        }
        const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>, t: Task) => {
            e.preventDefault();
            t.name = e.target.value;
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
                                    <div>
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
                                                {(t.project === undefined) ? "" : <span className={styles.spacer} />}
                                                {(t.hideChildren === undefined) ? <Page /> : <Tree />}
                                                <span style={{ paddingRight: 10 }} />
                                                <input className={styles.nameInput}
                                                    type="text" name="taskName"
                                                    onChange={e => handleTaskNameChange(e, t)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === 'Escape') {
                                                            e.currentTarget.blur();
                                                        }
                                                    }}
                                                    defaultValue={t.name} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={styles.taskListCell + " " + styles.taskListIcon}
                                    style={{
                                        minWidth: 15,
                                        maxWidth: 15,
                                    }}
                                >
                                    <div onClick={e => handleTaskDelete(e, t)}>
                                        <Trash style={{ fontSize: "1em", color: "red", cursor: "pointer" }} />
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