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

/**
 * 配列入れ替え
 * @param list 全タスクリスト
 * @param startIndex 移動元インデックス
 * @param endIndex 移動先インデックス
 * @returns 入れ替え後配列
 */
export const reOrder = (
  list: Task[],
  startIndex: number,
  endIndex: number,
): Task[] => {
  const result = Array.from(list);
  const removed = result.splice(startIndex, 1);
  result.splice(endIndex, 0, ...removed);

  return result;
};

/**
 * 子タスク再配置
 * @param list 全タスクリスト
 * @returns 入れ替え後整理されたリスト
 */
export const reOrderAll = (
  list: Task[],
): Task[] => {
  // プロジェクトだけ抽出
  const projectList = list.filter(t => t.type === "project");
  let tmpTasks = list;
  // 全プロジェクトに対して、子要素となるタスクを取得し、プロジェクト配下に持ってくる
  projectList.forEach(project => {
    let childTask: Task[] = [];
    tmpTasks = tmpTasks.filter(t => {
      if (t.project === project.id) {
        childTask.push(t);
        return false;
      } else {
        return true;
      }
    });
    // 抽出した要素を正しい位置に挿入
    let index = 0;
    // 移動したプロジェクトのindex取得　※抽出した箇所によってはインデックスが変わっている可能性があるため再度取得
    tmpTasks.forEach((t, v) => { if (project.id === t.id) index = v });
    tmpTasks.splice(index + 1, 0, ...childTask)
  })
  return tmpTasks;
};