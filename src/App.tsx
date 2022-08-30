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
import { reOrder } from "./helper";
import 'rsuite/dist/rsuite.min.css';
import "gantt-task-react/dist/index.css";


// Init
const App = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = useState(true);

  const [viewTask, setViewTask] = useState(0);

  const windowHeight = useWindowHeight();
  const rowHeight = 35;
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
  const childLimit = 100;

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


  // const escFunction = React.useCallback((event:any) => {
  //   if (event.keyCode === 27) {
  //     // キーコードを判定して何かする。
  //     console.log("Esc Key is pressed!");
  //   }
  // }, []);

  // useEffect(() => {
  //   document.addEventListener("keydown", escFunction, false);
  // }, []);

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
    const newTasks = [...tasks];
    // 上位プロジェクトが存在する場合
    if (task.project) {
      let maxIndex = 0;
      // プロジェクトの最終indexを取得
      newTasks.forEach((t, index) => {
        if (t.project === task.project || t.id === task.project) maxIndex = index;
      });
      newTasks.splice(maxIndex + 1, 0, task);
    } else {
      newTasks.push(task);
    }
    setTasks(newTasks);
    setViewTask(viewTask + 1);
    // setNewTaskId(task.id);
  };

  const speaker = (
    <Popover title={`チャートを追加`} style={{ width: "400px" }}>
      <AddTaskForm onAddTodoHandler={handleTaskAdd} tasks={tasks} childLimit={childLimit} />
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

  // タスクの削除、入れ替え処理をこの関数で行う。
  const handleSelect = (task: Task, isSelected: boolean) => {
    // console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));


    if (task.clickOnDeleteButtom) {
      delete task.clickOnDeleteButtom;
      handleTaskDelete(task);
    }

    if (task.replace) {
      if (task.replace.hideChildren !== undefined) {
        setTasks(
          tasks.map((t) => {
            if (t.id === task.id) t.hideChildren = task.replace!.hideChildren;
            return t
          })
        )
        delete task.replace.hideChildren;
      }

      if (task.replace.destinationTaskId !== undefined) {
        let indexs: number[] = [];
        // 移動元、移動先のインデックスをIDから取得
        let destinationTask: Task;
        // let destinationNextTask: Task;
        // let destinationPrevTask: Task;
        tasks.forEach((t, i) => {
          if (t.id === task.id) indexs[0] = i;
          if (t.id === task.replace!.destinationTaskId) {
            indexs[1] = i;
            destinationTask = t;
          };
        });
        // 入れ替え先の前後のタスクを取得
        // destinationNextTask = tasks[indexs[1] + 1];
        // destinationPrevTask = tasks[indexs[1] - 1];

        if (task.type === "task") {
          //移動した先がプロジェクトもしくは上位プロジェクトが存在する場合、上位プロジェクトを設定する
          if (destinationTask!.type === "project") {
            tasks[indexs[0]].project = destinationTask!.id;
          }
          if (destinationTask!.project) {
            tasks[indexs[0]].project = destinationTask!.project;
          }
        }

        // 順番入れ替え
        let reOrderTasks = reOrder(
          tasks,
          indexs[0],
          indexs[1],
        );
        // プロジェクトだった場合配下の要素をプロジェクト配下に持ってくる
        if (task.type === "project") {
          // 子要素を抽出した配列と抽出された後の配列で分ける
          let childTask: Task[] = [];
          let tmpTasks = reOrderTasks.filter(t => {
            if (t.project === task.id) {
              childTask.push(t);
              return false;
            } else {
              return true;
            }
          });
          // 抽出した要素を正しい位置に挿入
          let index = 0;
          // 移動したプロジェクトのindex取得　※抽出した箇所によってはインデックスが変わっている可能性があるため再度取得
          tmpTasks.forEach((t, v) => { if (task.id === t.id) index = v });
          tmpTasks.splice(index + 1, 0, ...childTask)
          reOrderTasks = tmpTasks;
        }

        setTasks(reOrderTasks);
        delete task.replace.destinationTaskId;
      }
    }
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    // console.log("On expander click Id:" + task.id);
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
        {tasks.length === 0 &&
          <div style={{ height: (windowHeight - headerHeight) + "px" }} className={styles.taskEmptyArea}>
            <div style={{ top: "50%", left: "45%", position: "absolute" }}>taskを追加してください</div>
          </div>
        }
        {tasks.length !== 0 &&
          <div className={styles.ganttArea} >
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
              handleWidth={5}
              viewDate={currentDate}
              // viewTask={12}
              listCellWidth={isChecked ? "100" : "0"}
              // ganttHeight={((rowHeight * tasks.length + headerHeight) > windowHeight) ? (windowHeight - headerHeight) : 0}
              columnWidth={columnWidth}
              locale={"ja-JP"}
              rowHeight={rowHeight}
              timeStep={86400000}
              fontFamily={"proxima-nova, 'Helvetica Neue', Helvetica, Arial, sans-serif,'proxima-nova','Helvetica Neue',Helvetica,Arial,sans-serif"}
            />
          </div>
        }
      </div>

      <Footer />
    </>
  );
};


export default App;
