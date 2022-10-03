import React, { useEffect, useState } from "react";
import { Task, Configuration, MessageType } from "./common/types/public-types";
import { Gantt, ViewMode } from "gantt-task-react";
import { PeriodSwitch } from "./components/period-switch";
import { AddTaskForm } from "./components/add-task-form";
import { Footer } from "./components/footer";
import { getStartEndDateForProject, initTasks, useWindowHeight } from "./helper";
import { TaskListHeader } from "./components/task-list-header";
import { TaskListColumn } from "./components/task-list-table";
// import { seedDates, ganttDateRange } from "./helpers/date-helper";
import { Navbar, Nav, IconButton, Popover, Whisper, Grid, Col, Row, Badge, Toggle, useToaster, Message } from 'rsuite';
import ExportIcon from '@rsuite/icons/Export';
import AddOutlineIcon from '@rsuite/icons/AddOutline';
import styles from "./index.module.css";
import commonStyles from "./common/css/index.module.css";
import CollaspedOutlineIcon from '@rsuite/icons/CollaspedOutline';
import { reOrder, reOrderAll, convertToggle2Flag, getData, pushNewData } from "./helper";
import 'rsuite/dist/rsuite.min.css';
import "gantt-task-react/dist/index.css";


// Init
const App = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = useState<Task[]>(initTasks());
  // const [notifyType, setNotifyType] = useState("info");
  // const [notifyMessage, setNotifyMessage] = useState("");
  const [title, setTitle] = useState("");
  const [viewTask, setViewTask] = useState(0);
  const [viewTitle, setViewTitle] = useState(true);
  const [viewPeriod, setViewPeriod] = useState(true);
  const [viewProgress, setViewProgress] = useState(true);
  const [saveButtonFlg, setSaveButtonDisable] = useState(true);
  const [saveHistory, setSaveHistory] = useState<Configuration[]>([]);

  const windowHeight = useWindowHeight();
  const rowHeight = 33;
  const headerHeight = 210;
  const date = new Date();
  const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDay());

  const toaster = useToaster();
  const message = (message: string, type: MessageType) => <Message showIcon type={type}>{message}</Message>;
  const info = (msg: string) => {
    if (msg !== "") toaster.push(message(msg, "success"));
  }

  // const [scrollX, setScrollX] = useState(-1);
  let columnWidth = 23;
  if (view === ViewMode.Month) {
    columnWidth = 200;
  } else if (view === ViewMode.Week) {
    columnWidth = 150;
  }

  //  First process. 
  useEffect(() => {
    // ローカルストレージからデータ取得
    const configs = getData() as Configuration[];
    if (configs) {
      setSaveHistory(configs);
      const config = configs[0];
      if (configs) {
        setTasks(config.tasks.map((t) => {
          t.start = new Date(t.start)
          t.end = new Date(t.end)
          return t
        }));
        setTitle(config.title);
        // setView(jsonConfig.mode);
        setViewTitle(config.viewWidth.title);
        setViewPeriod(config.viewWidth.period);
        setViewProgress(config.viewWidth.progress);
      }
    }
    // setTasks(confi);
    // 当日にスクロールする　Todo
    // const currentDate = new Date();
    // const [startDate, endDate] = ganttDateRange(tasks, view);
    // const test = seedDates(startDate, currentDate, view);
    // const retest = test.reverse();
    // const ele = document.getElementsByClassName("_2B2zv")
    // ele[0].scrollLeft = retest.length * columnWidth;
  }, [])


  const handleSave = () => {
    const config: Configuration = {
      title: title,
      tasks: tasks,
      viewWidth: {
        title: viewTitle,
        icon: viewTitle,
        period: viewPeriod,
        progress: viewProgress,
      },
      mode: view,
      modifyDate: `
      ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} (${["日", "月", "火", "水", "木", "金", "土"][date.getDay()]})`,
    }
    pushNewData(config);
    info("保存しました");
    setSaveHistory(getData() as Configuration[]);
    setSaveButtonDisable(true);
  }
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

    setTasks(reOrderAll(newTasks));
    setSaveButtonDisable(false);
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
    setSaveButtonDisable(false);
  };

  const speaker = (
    <Popover title={`チャートを追加`} style={{ width: "400px" }}>
      <AddTaskForm onAddTodoHandler={handleTaskAdd} tasks={tasks} />
    </Popover>
  );
  const speaker2 = (
    <Popover title={`保存履歴`} style={{ width: "300px" }}>
      {saveHistory.length === 0 &&
        <span>保存データはありません。</span>
      }
      {saveHistory.length >= 1 &&
        saveHistory.map((data) => {
          return <li>{data.modifyDate} に保存しました。</li>
        })}
    </Popover>
  );

  const handleTaskDelete = (task: Task) => {
    setTasks(tasks.filter((t) => {
      // 自分自身を削除
      if (t.id === task.id) {
        return false;
        // 削除元がプロジェクトかつ、配下のタスクは削除対象
      } else if (t.project === task.id && task.type === "project") {
        return false;
      } else {
        return true;
      }
    }))
    setSaveButtonDisable(false);
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
    /**
     * タスクのアクションを定義する
     */
    if (task.action) {

      // タスク更新時のアクション
      if (task.action.modify !== undefined) {
        handleTaskChange(task);
        delete task.action.modify;
      }

      // プロジェクトをドラッグアンドドロップしているときは子要素は閉じる
      if (task.action.hideChildren !== undefined) {
        setTasks(
          tasks.map((t) => {
            if (t.id === task.id) t.hideChildren = task.action!.hideChildren;
            return t
          })
        )
        delete task.action.hideChildren;
      }

      // ドラッグアンドドロップのアクションを定義
      if (task.action.destinationTaskId) {
        // 移動元、移動先のインデックスをIDから取得
        let sIndex = tasks.findIndex(t => (t.id === task.id));
        let dIndex = tasks.findIndex(t => (t.id === task.action!.destinationTaskId));
        let destinationTask = tasks[dIndex];

        // 移動の向き確認
        const moveDown = sIndex < dIndex;
        if (task.type === "task") {
          //移動した先がプロジェクトもしくは上位プロジェクトが存在する場合、上位プロジェクトを設定する
          if (destinationTask!.type === "project") {
            if (moveDown) {
              tasks[sIndex].project = destinationTask!.id;
            } else {
              delete tasks[sIndex].project;
            }
          } else {
            if (destinationTask!.project) {
              tasks[sIndex].project = destinationTask!.project;
            } else {
              delete tasks[sIndex].project;
            }
          }
        }
        // 順番入れ替え
        let reOrderTasks = reOrder(
          tasks,
          sIndex,
          dIndex,
        );
        // プロジェクトだった場合配下の要素をプロジェクト配下に持ってくる
        if (task.type === "project") reOrderTasks = reOrderAll(reOrderTasks);

        setTasks(reOrderTasks);
        delete task.action;
      }
    }
    setSaveButtonDisable(false);
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    // console.log("On expander click Id:" + task.id);
  };

  const closeProject = () => {
    setTasks(tasks.map((t) => {
      if (t.type === "project") {
        t.hideChildren = true;
      }
      return t;
    }));
  };

  return (
    <>
      <Navbar>
        <Navbar.Brand ><span className={styles.logo}>Gant chart</span></Navbar.Brand>
        <Nav pullRight>
          <Nav.Item><Badge>お知らせ</Badge></Nav.Item>
          <Nav.Item>このサイトについて</Nav.Item>
          <Nav.Item>規約</Nav.Item>
          <Nav.Item>ライセンス</Nav.Item>
        </Nav>
      </Navbar>
      <div className={commonStyles.contents} >
        <Grid fluid>
          <Row className="show-grid">
            <Col xs={14} className={styles.projectTitle}>
              <div>
                <input type="text" className={commonStyles.taskLabel} onChange={e => {
                  setSaveButtonDisable(false);
                  setTitle(e.target.value)}} defaultValue={title} placeholder="タイトルを入力" />
              </div>
            </Col>

            <Col xs={8} xsPush={2} className={styles.buttonArea}>
              <Whisper placement="leftStart" trigger="click" controlId="control-id-click" speaker={speaker}>
                <IconButton size="md" appearance="ghost" icon={<AddOutlineIcon />}>追加</IconButton>
              </Whisper>
              <span className={commonStyles.icon} />
              <Whisper placement="bottomEnd" trigger="hover" controlId="control-id-click" speaker={speaker2}>
                <IconButton size="md" color="green" appearance="ghost" onClick={() => handleSave()} icon={<ExportIcon />} disabled={saveButtonFlg}>保存</IconButton>
              </Whisper>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={12} className={styles.displayOptionArea}>
              <CollaspedOutlineIcon onClick={() => closeProject()} style={{ fontSize: "1em", marginRight: 10, cursor: "pointer" }} />
              <Toggle size="sm" onChange={e => { setViewTitle(e) }} checked={viewTitle} />名前
              <Toggle size="sm" onChange={e => { setViewPeriod(e) }} checked={viewPeriod} />期間
              <Toggle size="sm" onChange={e => { setViewProgress(e) }} checked={viewProgress} />%
              {/* <Toggle size="sm" />期間<Toggle size="sm" />% */}
            </Col>
            <Col xs={12} className={styles.displayOptionArea2}>
              <PeriodSwitch
                onViewModeChange={(viewMode) => setView(viewMode)}
                isViewMode={view}
              />
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
              listCellWidth={convertToggle2Flag({
                title: viewTitle,
                icon: viewTitle,
                period: viewPeriod,
                progress: viewProgress
              })}
              // ganttHeight={((rowHeight * tasks.length + headerHeight) > windowHeight) ? (windowHeight - headerHeight) : 0}
              ganttHeight={0}
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
