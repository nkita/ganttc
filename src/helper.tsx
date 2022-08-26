import { useLayoutEffect, useState } from "react";
import { Task } from "./common/types/public-types";

export function initTasks() {
  const tasks: Task[] = [];
  return tasks;
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter(t => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}

export const useWindowHeight = (): number => {
  const [height, setSize] = useState(0);
  useLayoutEffect(() => {
    const updateSize = (): void => {
      setSize(window.innerHeight);
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return height;
};
