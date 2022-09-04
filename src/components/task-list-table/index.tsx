import React, { useState } from "react";
import styles from "./index.module.css";
import { Task, MessageType } from "../../common/types/public-types"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Message, useToaster } from "rsuite";
import { Name } from "./name";
import { Period } from "./period";
import { Progress } from "./progress";
import { Edit } from "./edit";
import { Expander } from "./expander";
import type {
    DropResult,
    DraggingStyle,
    NotDraggingStyle,
    DroppableProvided,
    DroppableStateSnapshot,
    DraggableProvided,
    DraggableStateSnapshot
} from "@hello-pangea/dnd";
import 'rsuite/dist/rsuite.min.css';

const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
    background: isDragging ? "#e6f2ff" : "",
    border: isDragging ? "1px solid #1675e0" : "",
    borderRadius: isDragging ? "3px" : "",
    fontWeight: isDragging ? "bold" : "",
    paddingTop: isDragging ? "5px" : "",
    ...draggableStyle
});
// ドラッグ&ドロップのリストのスタイル
const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "white" : "white",
});

const message = (message: string, type: MessageType) => <Message showIcon type={type}>{message}</Message>;

export const TaskListColumn: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
}> = ({
    rowHeight,
    rowWidth,
    tasks,
    fontFamily,
    fontSize,
    locale,
    setSelectedTask,
    onExpanderClick,
}) => {
        const [orgHideChildren, setOrgHideChildren] = useState<boolean>();
        const toaster = useToaster();

        const endDrag = (result: DropResult) => {
            // 移動の向き確認
            const task = tasks[result.source.index];
            // ドロップ先がない場合移動できない
            if (!result.destination) {
                task.replace = { hideChildren: orgHideChildren }
                setSelectedTask(task.id);
                toaster.push(message("範囲外に移動することはできません。", "warning"));
                return;
            }
            const moveDown = result.source.index < result.destination.index;
            const destinationTask = tasks[result.destination.index];
            // プロジェクトからプロジェクト内部へは移動できない
            if (task.type === "project") {
                if (result.destination.index !== tasks.length - 1 && result.source.index !== 0) {
                    if (moveDown && destinationTask.type === "project") {
                        task.replace = { hideChildren: orgHideChildren }
                        toaster.push(message("プロジェクト配下へは移動できません。", "warning"));
                        setSelectedTask(task.id);
                        return;
                    }
                    if (destinationTask.type === "task" && destinationTask.project) {
                        task.replace = { hideChildren: orgHideChildren }
                        toaster.push(message("プロジェクト配下へは移動できません。", "warning"));
                        setSelectedTask(task.id);
                        return;
                    }
                }
            }
            task.replace = {
                destinationTaskId: destinationTask.id,
                hideChildren: orgHideChildren,
            }
            setSelectedTask(task.id);
        };

        const iconWidth = 30;
        const rowWidthLong = (rowWidth !== "0") ? Number(rowWidth) * 2 : 200;

        const taskDelete = (e: React.MouseEvent<HTMLElement>, t: Task) => {
            t.clickOnDeleteButtom = true;
            setSelectedTask(t.id);
        }
        // const taskNameChange = (e: React.ChangeEvent<HTMLInputElement>, t: Task) => {
        //     e.preventDefault();
        //     t.name = e.target.value;
        //     setSelectedTask(t.id);
        // }
        const progressChange = (e: React.ChangeEvent<HTMLSelectElement>, t: Task) => {
            t.progress = Number(e.target.value);
            setSelectedTask(t.id);
        }

        const mouseDown = (t: Task) => {
            // プロジェクトタスクがマウスダウンした場合（drag and drop直前）、子要素をまとめる
            if (t.type === "project") {
                t.replace = { hideChildren: true };
                // プロジェクトのすべてのhideChidren要素を一時保管しておく
                setOrgHideChildren(t.hideChildren);
                setSelectedTask(t.id);
            }
        }

        const onMouseUp = (t: Task) => {
            t.replace = { hideChildren: orgHideChildren }
            setSelectedTask(t.id);
        }
        return (
            <DragDropContext onDragEnd={endDrag}>
                <Droppable droppableId="droppable">
                    {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            <div
                                className={styles.taskListWrapper}
                                style={{
                                    fontFamily: fontFamily,
                                    fontSize: fontSize,
                                }}
                            >
                                {tasks.map((t, index) => {
                                    return (
                                        <Draggable
                                            key={t.id}
                                            draggableId={"DraggableId:" + t.id}
                                            index={index}
                                        >
                                            {(
                                                provided: DraggableProvided,
                                                snapshot: DraggableStateSnapshot
                                            ) => (
                                                <>
                                                    <div
                                                        className={styles.taskListTableRow}
                                                        key={`${t.id}row`}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={
                                                            Object.assign(
                                                                getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided.draggableProps.style
                                                                ), { height: rowHeight })
                                                        }
                                                    >
                                                        <Expander
                                                            task={t}
                                                            rowWidth={iconWidth}
                                                            onExpanderClick={onExpanderClick}
                                                        />
                                                        {/* プロジェクトクリック時にタスクが格納されるアクションを追加 */}
                                                        <Name
                                                            task={t}
                                                            rowWidth={rowWidthLong}
                                                            onMouseDown={mouseDown}
                                                            onMouseUp={onMouseUp}
                                                        />
                                                        <Edit
                                                            task={t}
                                                            rowWidth={iconWidth}
                                                            handleEditTask={taskDelete}
                                                            onMouseDown={mouseDown}
                                                            onMouseUp={onMouseUp}
                                                        />
                                                        <Period
                                                            task={t}
                                                            rowWidth={rowWidth}
                                                            locale={locale}
                                                            onMouseDown={mouseDown}
                                                            onMouseUp={onMouseUp}
                                                        />
                                                        <Progress
                                                            task={t}
                                                            rowWidth={rowWidth}
                                                            handleProgressChange={progressChange}
                                                            onMouseDown={mouseDown}
                                                            onMouseUp={onMouseUp}
                                                        />
                                                    </div>
                                                </>
                                            )
                                            }
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div >
                        </div>
                    )}
                </Droppable>
            </DragDropContext >
        );
    };