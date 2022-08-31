import React from "react";
import styles from "./index.module.css";
import { Task } from "../../common/types/public-types"

import 'rsuite/dist/rsuite.min.css';

export const Expander: React.FC<{
    task: Task;
    rowWidth: number;
    onExpanderClick: (task: Task) => void;
}> = ({
    task,
    rowWidth,
    onExpanderClick,
}) => {
        let expanderSymbol;
        if (task.type === "project") expanderSymbol = (task.hideChildren) ? "+" : "−";

        return (
            <>
                <div
                    className={styles.taskListCell}
                    style={{
                        minWidth: `${rowWidth}px`,
                        maxWidth: `${rowWidth}px`,
                    }}
                    title={task.name}
                >
                    {expanderSymbol &&
                        <button
                            className={styles.taskListExpander}
                            onClick={() => onExpanderClick(task)}
                        >
                            {expanderSymbol}
                        </button>
                    }
                </div>
            </>
        );
    };