import React, { useEffect, useMemo, useState } from "react";
import styles from "./index.module.css";
import { Task } from "../../common/types/public-types"
import Trash from '@rsuite/icons/Trash';
import Tree from '@rsuite/icons/Tree';
import Page from '@rsuite/icons/Page';
import commonStyles from "../../common/css/index.module.css";
import { Whisper, Tooltip } from 'rsuite';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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


const localeDateStringCache: { [key: string]: string } = {};
const toLocaleDateStringFactory =
    (locale: string) =>
        (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
            const key = date.toString();
            let lds = localeDateStringCache[key];
            if (!lds) {
                //　多言語対応
                // lds = date.toLocaleDateString(locale, dateTimeOptions);
                // 日本語用
                lds = date.getMonth() + 1 + "/" + date.getDate();
                localeDateStringCache[key] = lds;
            }
            return lds;
        };
const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
};

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

        const namesRef = React.useRef<HTMLInputElement>(null);
        useEffect(() => {
            // namesRef.current?.scrollIntoView();
        }, [tasks])
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
        const toLocaleDateString = useMemo(
            () => toLocaleDateStringFactory(locale),
            [locale]
        );

        return (
            <>
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
                                                            <div
                                                                className={styles.taskListCell}
                                                                style={{
                                                                    minWidth: `${rowWidthLong}px`,
                                                                    maxWidth: `${rowWidthLong}px`,
                                                                }}
                                                                title={t.name}
                                                            >
                                                                <div>
                                                                    <div className={styles.taskListNameWrapper}>
                                                                        <div
                                                                            className={
                                                                                expanderSymbol
                                                                                    ? styles.taskListExpander
                                                                                    : styles.taskListEmptyExpander
                                                                            }
                                                                            onClick={() => onExpanderClick(t)}
                                                                        >
                                                                            {expanderSymbol}
                                                                        </div>
                                                                        {(t.project !== undefined) &&
                                                                            <div style={{
                                                                                maxWidth: "35px",
                                                                                minWidth: "35px"
                                                                            }}>
                                                                            </div>
                                                                        }
                                                                        {(t.project === undefined && t.type === "task") &&
                                                                            <div style={{
                                                                                maxWidth: "21px",
                                                                                minWidth: "21px"
                                                                            }}>
                                                                            </div>
                                                                        }
                                                                        <Whisper
                                                                            placement="bottomStart" controlId="control-id-hover" trigger="hover"
                                                                            speaker={
                                                                                <Tooltip>{t.name}</Tooltip>}>
                                                                            <div>
                                                                                {(t.type === "task") ? <Page /> : <Tree />}
                                                                                <input className={commonStyles.taskLabel}
                                                                                    type="text" name="taskName" title={t.name}
                                                                                    onChange={e => handleTaskNameChange(e, t)}
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === 'Enter' || e.key === 'Escape') {
                                                                                            // e.currentTarget.blur();
                                                                                        }
                                                                                    }}
                                                                                    ref={namesRef}
                                                                                    defaultValue={t.name} />
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
                                                                <div onClick={e => handleTaskDelete(e, t)}>
                                                                    <Trash style={{ fontSize: "1em", color: "red", cursor: "pointer" }} />
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={styles.taskListCell}
                                                                style={{
                                                                    minWidth: `${rowWidth}px`,
                                                                    maxWidth: `${rowWidth}px`,
                                                                    textAlign: "center",
                                                                }}
                                                            >
                                                                <span>{toLocaleDateString(t.start, dateTimeOptions)}</span>
                                                                -
                                                                <span>{toLocaleDateString(t.end, dateTimeOptions)}</span>
                                                            </div>
                                                            <div
                                                                className={styles.taskListCell}
                                                                style={{
                                                                    minWidth: `${rowWidth}px`,
                                                                    maxWidth: `${rowWidth}px`,
                                                                    textAlign: "center",
                                                                }}
                                                            >
                                                                <select name="progress" className={styles.select} onChange={(e) => handleProgressChange(e, t)} value={t.progress} >
                                                                    <option value={0}>0%</option>
                                                                    <option value={25}>25%</option>
                                                                    <option value={50}>50%</option>
                                                                    <option value={75}>75%</option>
                                                                    <option value={100}>100%</option>
                                                                </select>
                                                            </div>
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
            </>
        );
    };