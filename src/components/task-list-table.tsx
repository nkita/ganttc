import React from "react";
import { Task } from "gantt-task-react";


interface ITaskListColumn {
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
}

export const TaskListColumn: React.FC<ITaskListColumn> = ({ tasks }) => {
    return (
        <div>
            {tasks.map((item) => {
                return (
                    <div>{item.name}</div>
                );
            })}
        </div>
    );
};