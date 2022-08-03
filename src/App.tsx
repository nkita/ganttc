import React, { useEffect } from "react";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { TaskListSwitcher } from "./components/task-list-switcher";
import { PeriodSwitcher } from "./components/period-switcher";
import { AddTask } from "./components/input-form";
import { Footer } from "./components/footer";
import { getStartEndDateForProject, initTasks } from "./helper";
import { TaskListHeader } from "./custom/task-list-header";
import { TaskListColumn } from "./custom/task-list-table";
import { seedDates, ganttDateRange } from "./custom/date-helper";
import Navbar from 'react-bootstrap/Navbar';
import styles from "./index.module.css";


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
    console.log(endDate, retest.length * columnWidth, retest.length, columnWidth);
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

  // const handleProgressChange = async (task: Task) => {
  //   setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
  //   console.log("On progress change Id:" + task.id);
  // };

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

  return (
    <>
      <Navbar bg="light" expand="lg">
        <TaskListSwitcher
          onViewListChange={setIsChecked}
          isChecked={isChecked}
        />
        <Navbar.Brand href="#home">Gant chart</Navbar.Brand>
        <PeriodSwitcher
          onViewModeChange={(viewMode) => setView(viewMode)}
          isViewMode={view}
        />
      </Navbar>

        <AddTask onAddTodoHandler={handleTaskAdd} />
        <div className={styles.gantt}>
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
          ganttHeight={getWindowDimensions().height - 300}
          columnWidth={columnWidth}
          locale={"ja-JP"}
          rowHeight={50}
          fontFamily={"proxima-nova, 'Helvetica Neue', Helvetica, Arial, sans-serif,'proxima-nova','Helvetica Neue',Helvetica,Arial,sans-serif"}
        />
      </div>
      <Footer />
    </>
  );
};


export default App;
