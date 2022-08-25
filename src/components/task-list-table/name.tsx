import React from "react";
import styles from "./index.module.css";
import { Task } from "../../common/types/public-types"
import Trash from '@rsuite/icons/Trash';
import Tree from '@rsuite/icons/Tree';
import Page from '@rsuite/icons/Page';
import commonStyles from "../../common/css/index.module.css";
import { Whisper, Tooltip } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';


export const Name: React.FC<{
    task: Task;
    rowWidth: number;
    expanderSymbol: string;
    iconWidth: number;
    handleTaskNameChange: (e: React.ChangeEvent<HTMLInputElement>, task: Task) => void;
    handleTaskDelete: (e: React.MouseEvent<HTMLElement>, task: Task) => void;
    onExpanderClick: (task: Task) => void;
}> = ({
    task,
    rowWidth,
    expanderSymbol,
    iconWidth,
    handleTaskNameChange,
    handleTaskDelete,
    onExpanderClick,
}) => {
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
                    <div>
                        <div className={styles.taskListNameWrapper}>
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
                            {(task.project !== undefined) &&
                                <div style={{
                                    maxWidth: "35px",
                                    minWidth: "35px"
                                }}>
                                </div>
                            }
                            {(task.project === undefined && task.type === "task") &&
                                <div style={{
                                    maxWidth: "21px",
                                    minWidth: "21px"
                                }}>
                                </div>
                            }
                            <Whisper
                                placement="bottomStart" controlId="control-id-hover" trigger="hover"
                                speaker={
                                    <Tooltip>{task.name}</Tooltip>}>
                                <div>
                                    {(task.type === "task") ? <Page /> : <Tree />}
                                    <input className={commonStyles.taskLabel}
                                        type="text" name="taskName" title={task.name}
                                        onChange={e => handleTaskNameChange(e, task)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === 'Escape') {
                                                // e.currentTarget.blur();
                                            }
                                        }}
                                        defaultValue={task.name} />
                                </div>
                            </Whisper>
                        </div>
                    </div>
                </div>
                <div
                    className={styles.taskListCell + " " + styles.taskListIcon}
                    style={{
                        minWidth: `${iconWidth}px`,
                        maxWidth: `${iconWidth}px`,
                        paddingLeft: 10,
                    }}
                >
                    <div onClick={e => handleTaskDelete(e, task)}>
                        <Trash style={{ fontSize: "1em", color: "red", cursor: "pointer" }} />
                    </div>
                </div>
            </>
        );
    };