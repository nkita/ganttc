import React from "react";
import styles from "./index.module.css";
import { Task } from "../../common/types/public-types"
import Tree from '@rsuite/icons/Tree';
import Page from '@rsuite/icons/Page';
import commonStyles from "../../common/css/index.module.css";
import { Whisper, Tooltip } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';


export const Name: React.FC<{
    task: Task;
    rowWidth: number;
}> = ({
    task,
    rowWidth,
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
                    <div className={styles.taskListNameWrapper}>
                        {/* 上位プロジェクトが存在する場合はインデントを大きく下げる */}
                        {(task.project !== undefined) &&
                            <div style={{
                                maxWidth: "35px",
                                minWidth: "35px"
                            }}>
                            </div>
                        }
                        <div>
                            {(task.type === "task") ? <Page /> : <Tree />}
                            <Whisper
                                placement="bottomStart" controlId="control-id-hover" trigger="hover"
                                speaker={<Tooltip>{task.name}</Tooltip>}>
                                <label className={commonStyles.taskLabel}>
                                    {task.name}
                                </label>
                            </Whisper>
                        </div>
                    </div>
                </div>
            </>
        );
    };