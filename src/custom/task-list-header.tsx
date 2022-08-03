import React from "react";
import styles from "./task-list-header.module.css";

// 日付の横幅
const rowWidthShort = 100;
const rowWidthLong = 200;

interface ITaskListHeader {
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
}

export const TaskListHeader: React.FC<ITaskListHeader> = ({
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth
}) => {
    return (
        <div
            className={styles.ganttTable}
            style={{
                fontFamily: fontFamily,
                fontSize: fontSize,
            }}
        >
            <div
                className={styles.ganttTable_Header}
                style={{
                    height: headerHeight - 2,
                }}
            >
                <div
                    className={styles.ganttTable_HeaderItem}
                    style={{
                        minWidth: rowWidthLong,
                        textAlign:"center",
                    }}
                >
                    名前
                </div>
                <div
                    className={styles.ganttTable_HeaderSeparator}
                    style={{
                        height: headerHeight * 0.5,
                        marginTop: headerHeight * 0.2,
                    }}
                />
                <div
                    className={styles.ganttTable_HeaderItem}
                    style={{
                        minWidth: rowWidthShort,
                        textAlign: "center",
                    }}
                >
                期間
            </div>
            <div
                className={styles.ganttTable_HeaderSeparator}
                style={{
                    height: headerHeight * 0.5,
                    marginTop: headerHeight * 0.25,
                }}
            />
            <div
                className={styles.ganttTable_HeaderItem}
                style={{
                    minWidth: rowWidthShort,
                    textAlign: "center",
                }}
            >
                進捗
            </div>
        </div>
        </div >
    );
};

// export const TaskListTable: React.FC<