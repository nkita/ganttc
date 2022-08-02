import React from 'react';
import "gantt-task-react/dist/index.css";
import Dropdown from 'react-bootstrap/Dropdown';
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
    <div className="ViewContainer">
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {isViewMode}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => { onViewModeChange(ViewMode.Day) }}>Day</Dropdown.Item>
          <Dropdown.Item onClick={() => { onViewModeChange(ViewMode.Week) }}>Week</Dropdown.Item>
          <Dropdown.Item onClick={() => { onViewModeChange(ViewMode.Month) }}>Month</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
