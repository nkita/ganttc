import React from "react";
import styles from "./task-list-header.module.css";

// 日付の横幅
const rowWidthLong = 250;

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
                        textAlign: "center",
                    }}
                >
                    Title
                </div>
                <div
                    className={styles.ganttTable_HeaderItem}
                    style={{
                        minWidth: rowWidth,
                        maxWidth: rowWidth,
                        textAlign: "center",
                    }}
                >
                    期間
                </div>

                <div
                    className={styles.ganttTable_HeaderItem}
                    style={{
                        minWidth: rowWidth,
                        maxWidth: rowWidth,
                        textAlign: "center",
                    }}
                >
                    %
                </div>
            </div>
        </div >
    );
};

// export const TaskListTable: React.FC<