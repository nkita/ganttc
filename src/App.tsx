import React, { useEffect, useState } from "react";
import { Task } from "./common/types/public-types";
import { Gantt, ViewMode } from "gantt-task-react";
import { LabelHideSwitch } from "./components/label-hide-switch";
import { PeriodSwitch } from "./components/period-switch";
import { AddTaskForm } from "./components/add-task-form";
import { Footer } from "./components/footer";
import { getStartEndDateForProject, initTasks, useWindowHeight } from "./helper";
import { TaskListHeader } from "./components/task-list-header";
import { TaskListColumn } from "./components/task-list-table";
// import { seedDates, ganttDateRange } from "./helpers/date-helper";
import { Navbar, Nav, IconButton, Popover, Whisper, Grid, Col, Row, Badge } from 'rsuite';
import ExportIcon from '@rsuite/icons/Export';
import AddOutlineIcon from '@rsuite/icons/AddOutline';
import styles from "./index.module.css";
import commonStyles from "./common/css/index.module.css";
import 'rsuite/dist/rsuite.min.css';
import "gantt-task-react/dist/index.css";


// Init
const App = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = useState(true);
  const windowHeight = useWindowHeight();
  const rowHeight = 40;
  const headerHeight = 210;
  const date = new Date();
  const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDay());

  // const [scrollX, setScrollX] = useState(-1);
  let columnWidth = 25;
  if (view === ViewMode.Month) {
    columnWidth = 200;
  } else if (view === ViewMode.Week) {
    columnWidth = 150;
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
    setTasks(newTasks);
  };

  const speaker = (
    <Popover title={`チャートを追加`} style={{ width: "400px" }}>
      <AddTaskForm onAddTodoHandler={handleTaskAdd} tasks={tasks} />
    </Popover>
  );

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    // Todo プロジェクトを消したときに配下のタスクも消すか確認
    if (conf) setTasks(tasks.filter((t) => t.id !== task.id));

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
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    if (task.clickOnDeleteButtom) {
      task.clickOnDeleteButtom = false;
      handleTaskDelete(task);
    } else {
      setTasks(newTasks);
    }
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  return (
    <>
      <Navbar>
        <Navbar.Brand ><span className={styles.logo}>Gant chart</span></Navbar.Brand>
        <Nav pullRight>
          <PeriodSwitch
            onViewModeChange={(viewMode) => setView(viewMode)}
            isViewMode={view}
          />
        </Nav>
        <Nav pullRight>
          <Nav.Item><Badge>お知らせ</Badge></Nav.Item>
          <Nav.Menu title="その他">
            <Nav.Item>このサイトについて</Nav.Item>
            <Nav.Item>規約</Nav.Item>
            <Nav.Item>ライセンス</Nav.Item>
          </Nav.Menu>
        </Nav>
      </Navbar>
      <div className={commonStyles.contents} >
        <Grid fluid>
          <Row className="show-grid">
            <Col xs={14} className={styles.projectTitle}>
              <div>
                <LabelHideSwitch
                  onViewListChange={setIsChecked}
                  isChecked={isChecked}
                />
                <input type="text" className={commonStyles.taskLabel} defaultValue={""} placeholder="タイトルを入力" />
              </div>
            </Col>

            <Col xs={8} xsPush={2} className={styles.buttonArea}>
              <Whisper placement="leftStart" trigger="click" controlId="control-id-click" speaker={speaker}>
                <IconButton size="md" appearance="ghost" icon={<AddOutlineIcon />}>追加</IconButton>
              </Whisper>
              <span className={commonStyles.icon} />
              <IconButton size="md" color="green" appearance="ghost" icon={<ExportIcon />}>保存</IconButton>
            </Col>
          </Row>
        </Grid>
        <Gantt
          tasks={tasks}
          viewMode={view}
          TaskListHeader={TaskListHeader}
          TaskListTable={TaskListColumn}
          onDateChange={handleTaskChange}
          onDelete={handleTaskDelete}
          onDoubleClick={handleDblClick}
          onSelect={handleSelect}
          onExpanderClick={handleExpanderClick}
          preStepsCount={2}
          viewDate={currentDate}
          listCellWidth={isChecked ? "100" : "0"}
          ganttHeight={((rowHeight * tasks.length + headerHeight) > windowHeight) ? (windowHeight - headerHeight) : 0}
          columnWidth={columnWidth}
          locale={"ja-JP"}
          rowHeight={rowHeight}
          timeStep={86400000}
          fontFamily={"proxima-nova, 'Helvetica Neue', Helvetica, Arial, sans-serif,'proxima-nova','Helvetica Neue',Helvetica,Arial,sans-serif"}
        />
      </div>
      <Footer />


    </>
  );
};


export default App;
