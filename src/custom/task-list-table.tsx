import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../common/types/public-types"

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
                lds = date.getMonth() + "/" + date.getDate();
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
                                        {/* onClick={() => onSelectLabel(t.id)}> */}
                                        {t.name}
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
            </div>
        );
    };