import React from "react";
import styles from "./index.module.css";
import { Task } from "../../common/types/public-types"
import Trash from '@rsuite/icons/Trash';
import 'rsuite/dist/rsuite.min.css';


export const Edit: React.FC<{
    task: Task;
    handleEditTask: (e: React.MouseEvent<HTMLElement>, task: Task) => void;
}> = ({
    task,
    handleEditTask,
}) => {
        return (
            <>
                <div
                    className={styles.taskListCell + " " + styles.taskListIcon}
                    style={{
                        minWidth: "30px",
                        maxWidth: "30px",
                        paddingLeft: 10,
                    }}
                >
                    <div onClick={e => handleEditTask(e, task)}>
                        <Trash style={{ fontSize: "1em", color: "red", cursor: "pointer" }} />
                    </div>
                </div>
            </>
        );
    };