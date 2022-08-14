import React from 'react';
import { Dropdown } from 'rsuite';
import { ViewMode } from "gantt-task-react";
import { FaRegCalendarAlt } from "react-icons/fa";
import styles from "./index.module.css";

type PeriodSwitcherProps = {
  isViewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
};

export const PeriodSwitch: React.FC<PeriodSwitcherProps> = ({
  onViewModeChange,
  isViewMode,
}) => {
  return (
    <Dropdown size="sm" title="期間" icon={<FaRegCalendarAlt/>}>
      <Dropdown.Item className={styles.dropItem} onClick={() => { onViewModeChange(ViewMode.Day) }}>日<span className={styles.space}/>D</Dropdown.Item>
      <Dropdown.Item className={styles.dropItem} onClick={() => { onViewModeChange(ViewMode.Week) }}>週<span className={styles.space}/>W</Dropdown.Item>
      <Dropdown.Item className={styles.dropItem} onClick={() => { onViewModeChange(ViewMode.Month) }}>月<span className={styles.space}/>M</Dropdown.Item>
    </Dropdown>
  );
};
