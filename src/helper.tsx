import { useLayoutEffect, useState } from "react";
import { Task } from "./common/types/public-types";

const maxLayer = 5;
const maxChild = 100; // １階層で保持できるタスク数

export function initTasks() {
  const currentDate = new Date();
  const tasks: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "設計",
      id: "sekkei",
      progress: 0,
      type: "project",
      hideChildren: false,
      displayOrder: 10000000000,
      layer: 0
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Research",
      id: "基本設計書作成",
      progress: 0,
      type: "task",
      project: "sekkei",
      displayOrder: 10100000000,
      layer: 1,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "基本設計書　レビュー",
      id: "sekkei3",
      progress: 0,
      type: "task",
      project: "sekkei",
      displayOrder: 10200000000,
      layer: 1
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "基本設計書　完成",
      id: "sekkei4",
      progress: 0,
      type: "task",
      project: "sekkei",
      displayOrder: 10300000000,
      layer: 1
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "開発",
      id: "dev",
      progress: 0,
      type: "project",
      hideChildren: false,
      displayOrder: 20000000000,
      layer: 0
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "○○コード",
      id: "dev2",
      progress: 0,
      type: "task",
      project: "dev",
      displayOrder: 20100000000,
      layer: 1
    }
  ];
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
 * 
 * @param layer 取得したいレイヤー番号（0階層,1階層目...）
 * @param displayOrder displayOrder
 * @returns 指定したレイヤー番号のorder
 */
export function getLayerOrder(layer: number, displayOrder: number) {
  const left = Math.floor(displayOrder / maxChild ** (maxLayer - layer));
  const right = Math.floor(displayOrder / maxChild ** (maxLayer - layer + 1)) * maxChild;
  return left - right;
}

/**
 * 
 * @param setLayer セットしたい階層
 * @param setOrder セットしたいオーダー
 * @param upperProjectDisplayOrder 上位プロジェクトのdisplayOrder
 * @returns displayOrder
 */
export function getLayerOrderToDisplayOrder(
  setLayer: number,
  setOrder: number,
  upperProjectDisplayOrder = 0,
) {
  return setOrder * (maxChild ** (maxLayer - setLayer)) + upperProjectDisplayOrder;
}