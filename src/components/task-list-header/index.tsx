import React from "react";
import styles from "./index.module.css";
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
    const iconWidth = 30;
    const rowWidthLong = (rowWidth !== "0") ? Number(rowWidth) * 2 + iconWidth : 200 + iconWidth;
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
                {/* Expander Area */}
                <div
                    className={styles.ganttTable_HeaderItem}
                    style={{
                        minWidth: `${iconWidth}px`,
                        textAlign: "center",
                    }}
                >
                </div>
                <div
                    className={styles.ganttTable_HeaderItem}
                    style={{
                        minWidth: `${rowWidthLong}px`,
                        textAlign: "left",
                    }}
                >
                    名前
                </div>
                <div
                    className={styles.ganttTable_HeaderItem}
                    style={{
                        minWidth: `${rowWidth}px`,
                        maxWidth: `${rowWidth}px`,
                        textAlign: "center",
                    }}
                >
                    期間
                </div>

                <div
                    className={styles.ganttTable_HeaderItem}
                    style={{
                        minWidth: `${rowWidth}px`,
                        maxWidth: `${rowWidth}px`,
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