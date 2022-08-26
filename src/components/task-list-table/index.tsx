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
        // const [tasks2, setTasks] = useState(tasks);
        const taskOrderChange = (result: DropResult) => {
            // ドロップ先がないi
            if (!result.destination) return;
            const task = tasks[result.source.index];
            task.replace = {
                sourceIndex: result.source.index,
                destinationIndex: result.destination.index,
            }
            setSelectedTask(task.id);
        };

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

        return (
            <DragDropContext onDragEnd={taskOrderChange}>
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