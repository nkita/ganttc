import React from "react";
import { convertFlg2Width } from "../../helper";

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
    const width = convertFlg2Width(rowWidth);
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
                        maxWidth: `${width.icon}px`,
                        minWidth: `${width.icon}px`,
                        textAlign: "center",
                        overflow: "hidden"
                    }}
                >
                </div>
                <div
                    className={styles.ganttTable_HeaderItem}
                    style={{
                        maxWidth: `${width.title + width.icon}px`,
                        minWidth: `${width.title + width.icon}px`,
                        textAlign: "left",
                        overflow: "hidden"
                    }}
                >
                    名前
                </div>
                <div
                    className={styles.ganttTable_HeaderItem}
                    style={{
                        minWidth: `${width.period}px`,
                        maxWidth: `${width.period}px`,
                        textAlign: "center",
                        overflow: "hidden"
                    }}
                >
                    期間
                </div>

                <div
                    className={styles.ganttTable_HeaderItem}
                    style={{
                        minWidth: `${width.progress}px`,
                        maxWidth: `${width.progress}px`,
                        textAlign: "center",
                        overflow: "hidden"
                    }}
                >
                    %
                </div>
            </div>
        </div >
    );
};

// export const TaskListTable: React.FC<