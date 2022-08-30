import React from "react";
import styles from "./index.module.css";
import { Task } from "../../common/types/public-types"
import CollaspedOutlineIcon from '@rsuite/icons/CollaspedOutline';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
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
        if (task.type === "project") expanderSymbol = (task.hideChildren) ? <ExpandOutlineIcon /> : <CollaspedOutlineIcon />;

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
                    <div
                        className={
                            expanderSymbol
                                ? styles.taskListExpander
                                : styles.taskListEmptyExpander
                        }
                        onClick={() => onExpanderClick(task)}
                    >
                        {expanderSymbol}
                    </div>
                </div>
            </>
        );
    };