import React, { } from "react";
import styles from "./index.module.css";
import { Task } from "../../common/types/public-types"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Name } from "./name";
import { Period } from "./period";
import { Progress } from "./progress";
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
        // const [orgHideChildren, setOrgHideChildren] = useState(true);
        const endDrag = (result: DropResult) => {
            // ドロップ先がないi
            if (!result.destination) return;
            const task = tasks[result.source.index];
            const dTask = tasks[result.destination.index];
            // 子要素がいた場合表示・非表示の切り替えを行う
            // changeHideChildren(task);
            console.log(result.source.index);
            task.replace = {
                destinationTaskId: dTask.id,
            }
            setSelectedTask(task.id);
            // changeHideChildren(task);
        };

        // const changeHideChildren = (task: Task, flg: null | boolean = null) => {
        //     if (task.type === "project") {
        //         task.replace = { hideChildren: flg ?? orgHideChildren };
        //         // ドラッグ終わりに表示切り替えをもとに戻すために、子要素の表示・非表示フラグを取得する。
        //         setOrgHideChildren(task.hideChildren || false);
        //         // setSelectedTask(task.id);
        //     }
        // }

        const iconWidth = 30;
        const rowWidthLong = (rowWidth !== "0") ? Number(rowWidth) * 2 : 200;

        const taskDelete = (e: React.MouseEvent<HTMLElement>, t: Task) => {
            t.clickOnDeleteButtom = true;
            setSelectedTask(t.id);
        }
        const taskNameChange = (e: React.ChangeEvent<HTMLInputElement>, t: Task) => {
            e.preventDefault();
            t.name = e.target.value;
            setSelectedTask(t.id);
        }
        const progressChange = (e: React.ChangeEvent<HTMLSelectElement>, t: Task) => {
            t.progress = Number(e.target.value);
            setSelectedTask(t.id);
        }

        const mouseDown = (e: React.MouseEvent<HTMLDivElement>, t: Task) => {
            // changeHideChildren(t, true);
            console.log("DOWN");
        }
        const mouseUp = (e: React.MouseEvent<HTMLDivElement>, t: Task) => {
            // console.log("UP");
            // changeHideChildren(t);
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
                                    let expanderSymbol = "";
                                    if (t.hideChildren === false) {
                                        expanderSymbol = "▼";
                                    } else if (t.hideChildren === true) {
                                        expanderSymbol = "▶";
                                    }
                                    return (
                                        <Draggable
                                            key={t.id}
                                            draggableId={"q-" + t.id}
                                            index={index}
                                        >
                                            {(
                                                provided: DraggableProvided,
                                                snapshot: DraggableStateSnapshot
                                            ) => (
                                                <div
                                                    className={styles.taskListTableRow}
                                                    key={`${t.id}row`}
                                                    ref={provided.innerRef}
                                                    onMouseDown={(e) => { mouseDown(e, t) }}
                                                    onMouseUp={(e) => { mouseUp(e, t) }}
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
                                                    <Name
                                                        task={t}
                                                        rowWidth={rowWidthLong}
                                                        expanderSymbol={expanderSymbol}
                                                        iconWidth={iconWidth}
                                                        handleTaskNameChange={taskNameChange}
                                                        handleTaskDelete={taskDelete}
                                                        onExpanderClick={onExpanderClick}
                                                    />
                                                    <Period
                                                        task={t}
                                                        rowWidth={rowWidth}
                                                        locale={locale}
                                                    />
                                                    <Progress
                                                        task={t}
                                                        rowWidth={rowWidth}
                                                        handleProgressChange={progressChange}
                                                    />
                                                </div>
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