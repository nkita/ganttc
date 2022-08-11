import React, { useEffect, useState } from "react";
import { Task } from "./common/types/public-types";
import { Gantt, ViewMode } from "gantt-task-react";
import { TaskListSwitcher } from "./components/task-list-switcher";
import { PeriodSwitcher } from "./components/period-switcher";
import { AddTask } from "./components/input-form";
import { Footer } from "./components/footer";
import { getStartEndDateForProject, initTasks, useWindowHeight } from "./helper";
import { TaskListHeader } from "./custom/task-list-header";
import { TaskListColumn } from "./custom/task-list-table";
// import { seedDates, ganttDateRange } from "./custom/date-helper";
import { Navbar, Nav,  Container, Content, IconButton, ButtonToolbar, Popover, Whisper } from 'rsuite';
import Tree from '@rsuite/icons/Tree';
import Page from '@rsuite/icons/Page';
import styles from "./index.module.css";
import 'rsuite/dist/rsuite.min.css';

// Init
const App = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = useState(true);
  const windowHeight = useWindowHeight();
  const rowHeight = 40;
  const headerHeight = 250;

  // const [scrollX, setScrollX] = useState(-1);
  let columnWidth = 25;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }
  //  First process. *one-time-only
  useEffect(() => {
    console.log('useEffectが1回だけ実行されました');
    // 当日にスクロールする　Todo
    // const currentDate = new Date();
    // const [startDate, endDate] = ganttDateRange(tasks, view);
    // const test = seedDates(startDate, currentDate, view);
    // const retest = test.reverse();
    // const ele = document.getElementsByClassName("_2B2zv")
    // ele[0].scrollLeft = retest.length * columnWidth;
  }, [])


  const handleTaskChange = (task: Task) => {
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
    const newTasks = [...tasks];
    newTasks.push(task);
    console.log(newTasks[9], newTasks);
    setTasks(newTasks);
  };

  const speaker = (kind: string) => (
    <Popover title={`${kind}を追加`}>
      <AddTask onAddTodoHandler={handleTaskAdd} />
    </Popover>
  );

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
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    if (task.clickOnLabel) {
      console.log("Click on Label");
      task.clickOnLabel = false;
    }

    if (task.clickOnProgress) {
      console.log("Click on Progress");
      task.clickOnProgress = false;
    }

    setTasks(newTasks);
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  return (
    <>
      <Container>
        <Navbar>
          <Navbar.Brand >Gant chart</Navbar.Brand>
          <Nav>
            <Nav.Item>About us</Nav.Item>
            <Nav.Item>terms</Nav.Item>
          </Nav>
        </Navbar>
        <Content>
          <div className={styles.buttonArea}>
            <h3>プロジェクト名</h3>
          </div>
          <div className={styles.buttonArea}>
            <ButtonToolbar>
              <TaskListSwitcher
                onViewListChange={setIsChecked}
                isChecked={isChecked}
              />
              <Whisper placement="bottomStart" trigger="click" controlId="control-id-click" speaker={speaker("プロジェクト")}>
                <IconButton size="sm" icon={<Tree />}>追加</IconButton>
              </Whisper>
              <Whisper placement="bottomStart" trigger="click" controlId="control-id-click" speaker={speaker("タスク")}>
                <IconButton size="sm" icon={<Page />}>追加</IconButton>
              </Whisper>
              <PeriodSwitcher
                onViewModeChange={(viewMode) => setView(viewMode)}
                isViewMode={view}
              />
            </ButtonToolbar>
          </div>
          <div className={styles.gantt} >
            <Gantt
              tasks={tasks}
              viewMode={view}
              TaskListHeader={TaskListHeader}
              TaskListTable={TaskListColumn}
              onDateChange={handleTaskChange}
              onDelete={handleTaskDelete}
              onProgressChange={handleProgressChange}
              onDoubleClick={handleDblClick}
              onSelect={handleSelect}
              onExpanderClick={handleExpanderClick}
              listCellWidth={isChecked ? "100px" : "0px"}
              ganttHeight={((rowHeight * tasks.length + headerHeight) > windowHeight) ? (windowHeight - headerHeight) : 0}
              columnWidth={columnWidth}
              locale={"ja-JP"}
              rowHeight={rowHeight}
              timeStep={86400000}
              fontFamily={"proxima-nova, 'Helvetica Neue', Helvetica, Arial, sans-serif,'proxima-nova','Helvetica Neue',Helvetica,Arial,sans-serif"}
            />
          </div>
          <Footer />
        </Content>
      </Container>
    </>
  );
};


export default App;
