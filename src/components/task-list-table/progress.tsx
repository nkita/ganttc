import React from "react";
import styles from "./index.module.css";
import { Task } from "../../common/types/public-types"
import 'rsuite/dist/rsuite.min.css';

export const Progress: React.FC<{
    task: Task;
    rowWidth: string;
    handleProgressChange: (e: React.ChangeEvent<HTMLSelectElement>, task: Task) => void;
    onMouseDown: (task:Task) => void;
    onMouseUp:(task:Task) => void;
}> = ({
    task,
    rowWidth,
    handleProgressChange,
    onMouseDown,
    onMouseUp,
}) => {
        return (
            <>
                <div
                    className={styles.taskListCell}
                    style={{
                        minWidth: `${rowWidth}px`,
                        maxWidth: `${rowWidth}px`,
                        textAlign: "center",
                    }}
                    onMouseDown={() => onMouseDown(task)}
                    onMouseUp={()=>onMouseUp(task)}
                >
                    <select name="progress" className={styles.select}
                        onChange={
                            (e) => handleProgressChange(e, task)
                        }
                        value={task.progress}
                    >
                        <option value={0}>0%</option>
                        <option value={25}>25%</option>
                        <option value={50}>50%</option>
                        <option value={75}>75%</option>
                        <option value={100}>100%</option>
                    </select>
                </div>
            </>
        );
    };