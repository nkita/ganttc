import React from 'react';
import "gantt-task-react/dist/index.css";
import { Dropdown } from 'rsuite';
import { ViewMode } from "gantt-task-react";

type PeriodSwitcherProps = {
  isViewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
};

export const PeriodSwitcher: React.FC<PeriodSwitcherProps> = ({
  onViewModeChange,
  isViewMode,
}) => {
  return (
    <Dropdown size="sm" title={isViewMode}>
      <Dropdown.Item onClick={() => { onViewModeChange(ViewMode.Day) }}>Day  D</Dropdown.Item>
      <Dropdown.Item onClick={() => { onViewModeChange(ViewMode.Week) }}>Week  W</Dropdown.Item>
      <Dropdown.Item onClick={() => { onViewModeChange(ViewMode.Month) }}>Month  M</Dropdown.Item>
    </Dropdown>
  );
};
