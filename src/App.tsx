import React, { useEffect } from "react";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { AddTask } from "./components/input-form";
import { getStartEndDateForProject, initTasks } from "./helper";
import { TaskListHeader } from "./custom/task-list-header";
import { TaskListColumn } from "./custom/task-list-table";
import { seedDates } from "./custom/date-helper";


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
    // 当日にスクロールする
    // const currentDate = new Date();
    const test = seedDates(new Date(2022, 6, 30), new Date(2022, 7, 27), ViewMode.Day);
    const retest = test.reverse();
    console.log(retest, retest.length * columnWidth);
    const ele = document.getElementsByClassName("_CZjuD")

    // ele[0].scroll(retest.length * columnWidth, 0);
    ele[0].scroll((retest.length - 5) * columnWidth, 0);
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
  console.log(getWindowDimensions().height);

  return (
    <div>
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

export default App;
