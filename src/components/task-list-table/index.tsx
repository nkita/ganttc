import React, { useState } from "react";
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


// ドラッグ&ドロップした要素を入れ替える
const reorder = (
    list: Task[],
    startIndex: number,
    endIndex: number
): Task[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

// ドラッグ&ドロップの質問のスタイル
const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
    background: isDragging ? "#757ce8" : "white",
    ...draggableStyle
});
// ドラッグ&ドロップのリストのスタイル
const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "#1769aa" : "lightgrey",
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

        const [tasks2, setTasks] = useState(tasks);
        const onDragEnd = (result: DropResult) => {
            // ドロップ先がない
            if (!result.destination) {
                return;
            }
            // 配列の順序を入れ替える
            let movedItems = reorder(
                tasks2, //　順序を入れ変えたい配列
                result.source.index, // 元の配列の位置
                result.destination.index // 移動先の配列の位置
            );
            setTasks(movedItems);
        };

        const iconWidth = 30;
        const rowWidthLong = (rowWidth !== "0") ? Number(rowWidth) * 2 : 200;

        const handleTaskDelete = (e: React.MouseEvent<HTMLElement>, t: Task) => {
            t.clickOnDeleteButtom = true;
            setSelectedTask(t.id);
        }
        const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>, t: Task) => {
            e.preventDefault();
            t.name = e.target.value;
            setSelectedTask(t.id);
        }
        const handleProgressChange = (e: React.ChangeEvent<HTMLSelectElement>, t: Task) => {
            t.progress = Number(e.target.value);
            setSelectedTask(t.id);
        }

        return (
            <DragDropContext onDragEnd={onDragEnd}>
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
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}>
                                                    <div
                                                        className={styles.taskListTableRow}
                                                        style={{ height: rowHeight }}
                                                        key={`${t.id}row`}
                                                    >
                                                        <Name
                                                            task={t}
                                                            rowWidthLong={rowWidthLong}
                                                            expanderSymbol={expanderSymbol}
                                                            iconWidth={iconWidth}
                                                            handleTaskNameChange={handleTaskNameChange}
                                                            handleTaskDelete={handleTaskDelete}
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
                                                            handleProgressChange={handleProgressChange}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                            </div >
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    };