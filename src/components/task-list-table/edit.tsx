import React from "react";
import styles from "./index.module.css";
import { Task } from "../../common/types/public-types"
import EditIcon from '@rsuite/icons/Edit';
import { Modal } from 'rsuite';
import { EditTaskForm } from '../edit-task-form';

import 'rsuite/dist/rsuite.min.css';

export const Edit: React.FC<{
    task: Task;
    tasks: Task[];
    rowWidth: number;
    handleEditTask: (task: Task) => void;
    handleDeleteTask: (task: Task) => void;
    onMouseDown: (task: Task) => void;
    onMouseUp: (task: Task) => void;
}> = ({
    task,
    tasks,
    rowWidth,
    handleEditTask,
    handleDeleteTask,
    onMouseDown,
    onMouseUp,
}) => {
        const [open, setOpen] = React.useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);

        return (
            <>
                <Modal overflow={true} open={open} onClose={handleClose} size="xs">
                    <Modal.Header >
                        <Modal.Title>タスクの更新</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <EditTaskForm task={task} tasks={tasks} handleEditTask={handleEditTask} handleModalClose={handleClose}/>
                    </Modal.Body>
                </Modal>
                <div
                    className={styles.taskListCell + " " + styles.taskListIcon}
                    style={{
                        minWidth: `${rowWidth}px`,
                        maxWidth: `${rowWidth}px`,
                        paddingLeft: 10,
                    }}
                    onMouseDown={() => onMouseDown(task)}
                    onMouseUp={() => onMouseUp(task)}
                >
                    <div onClick={handleOpen}>
                        <EditIcon style={{ fontSize: "1em", color: "red", cursor: "pointer" }} />
                    </div>
                </div>
            </>
        );
    };