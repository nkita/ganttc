import React, { useEffect, useState } from "react";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { AddTask } from "./components/input-form";
import { getStartEndDateForProject, initTasks } from "./helper";
import { TaskListHeader } from "./custom/task-list-header";
import { TaskListColumn } from "./custom/task-list-table";
import { seedDates, ganttDateRange } from "./custom/date-helper";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


// Init
const App = () => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = React.useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = React.useState(true);
  // const [scrollX, setScrollX] = useState(-1);
  let columnWidth = 65;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  //  First process. *one-time-only
  useEffect(() => {
    console.log('useEffectが1回だけ実行されました');
    // 当日にスクロールする　Todo
    const currentDate = new Date();
    const [startDate, endDate] = ganttDateRange(tasks, view);
    const test = seedDates(startDate, currentDate, view);
    const retest = test.reverse();
    const ele = document.getElementsByClassName("_2B2zv")
    console.log(retest.length * columnWidth, retest.length, columnWidth);
    ele[0].scrollLeft = retest.length * columnWidth;
  }, [])

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project =
        newTasks[newTasks.findIndex((t) => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map((t) =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
  };

  const handleTaskAdd = (task: Task) => {
    // setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    setTasks((prevTasks) => [
      ...prevTasks,
      task,
    ]);
    console.log("[handleTaskAdd]", tasks);
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter((t) => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };


  const [isFirstColumn, setIsFirstColumn] = useState(true);
  const Item = <MovableItem setIsFirstColumn={setIsFirstColumn} />;

  return (
    <div>

      <div className="container">
        {/* Wrap components that will be "draggable" and "droppable" */}
        <DndProvider backend={HTML5Backend}>
          <Column title='Column 1' className='column first-column'>
            {isFirstColumn && Item}
          </Column>
          <Column title='Column 2' className='column second-column'>
            {!isFirstColumn && Item}
          </Column>
        </DndProvider>
      </div>

      <ViewSwitcher
        onViewModeChange={(viewMode) => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <AddTask onAddTodoHandler={handleTaskAdd} />
      {/* <h3>Gantt With Unlimited Height</h3> */}
      {/* Todo onSelectLabel */}
      {/* <Gantt
        tasks={tasks}
        viewMode={view}
        TaskListHeader={TaskListHeader}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        columnWidth={columnWidth}
      /> */}
      <h3>Gantt With Limited Height</h3>
      <Gantt
        tasks={tasks}
        viewMode={view}
        TaskListHeader={TaskListHeader}
        TaskListTable={TaskListColumn}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        // onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        // ganttHeight={getWindowDimensions().height-220}
        columnWidth={columnWidth}
        locale={"ja-JP"}
        rowHeight={50}
      />
    </div>
  );
};

/**********
 * https://medium.com/litslink/react-dnd-in-examples-ce509b25839d
 * https://react-dnd.github.io/react-dnd/docs/api/use-drag
 * https://codesandbox.io/s/github/react-dnd/react-dnd/tree/gh-pages/examples_ts/04-sortable/simple?from-embed=&file=/src/Container.tsx:1521-1638
 */
const MovableItem = ({ setIsFirstColumn }: { setIsFirstColumn: any }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { name: 'Any custom name', type: 'Our first type' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      // if (typeof dropResult === "object") {
      //   if (dropResult && dropResult.name === 'Column 1') {
          // setIsFirstColumn(true)
      //   } else {
          setIsFirstColumn(false);
      //   }
      // }
    },
    type: "row",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div ref={drag} className='movable-item' style={{ opacity }}>
      We will move this item
    </div>
  )
}

// const FirstColumn = () => {
//   return (
//     <div className='column first-column'>
//       Column 1
//       <MovableItem />
//     </div>
//   )
// }
const Column = ({ children, className, title }: { children: any, className: string, title: string }) => {
  const [, drop] = useDrop({
    accept: 'Our first type',
    drop: () => ({ name: title }),
  });

  return (
    <div ref={drop} className={className}>
      {title}
      {children}
    </div>
  )
}

// const SecondColumn = () => {
//   const [{ canDrop, isOver }, drop] = useDrop({
//     accept: 'row',
//     drop: () => ({ name: 'some name' }),
//     collect: (monitor: DropTargetMonitor) => ({
//       isOver: monitor.isOver(),
//       canDrop: monitor.canDrop(),
//     }),
//   })
//   console.log('options', { canDrop, isOver ,drop});
//   return (
//     <div ref={drop} className='column second-column'>
//       Column 2
//     </div>
//   )
// }



export default App;
