import React from "react";
import styles from "./index.module.css";
import { Task } from "../../common/types/public-types"
import Trash from '@rsuite/icons/Trash';
import 'rsuite/dist/rsuite.min.css';

export const Edit: React.FC<{
    task: Task;
    rowWidth: number;
    handleEditTask: (e: React.MouseEvent<HTMLElement>, task: Task) => void;
    onMouseDown: (task:Task) => void;
    onMouseUp:(task:Task) => void;
}> = ({
    task,
    rowWidth,
    handleEditTask,
    onMouseDown,
    onMouseUp,
}) => {
        return (
            <>
                <div
                    className={styles.taskListCell + " " + styles.taskListIcon}
                    style={{
                        minWidth: `${rowWidth}px`,
                        maxWidth: `${rowWidth}px`,
                        paddingLeft: 10,
                    }}
                    onMouseDown={() => onMouseDown(task)}
                    onMouseUp={()=>onMouseUp(task)}
                >
                    <div onClick={e => handleEditTask(e, task)}>
                        <Trash style={{ fontSize: "1em", color: "red", cursor: "pointer" }} />
                    </div>
                </div>
            </>
        );
    };