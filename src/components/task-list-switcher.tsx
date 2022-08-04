import React from 'react';
import "gantt-task-react/dist/index.css";

type TaskListSwitcherProps = {
  isChecked: boolean;
  onViewListChange: (isChecked: boolean) => void;
};

export const TaskListSwitcher: React.FC<TaskListSwitcherProps> = ({
  onViewListChange,
  isChecked,
}) => {
  return (
    <div className="ViewContainer">
      <div className="Switch">
        <label className="Switch_Toggle">
          <input
            type="checkbox"
            defaultChecked={isChecked}
            onClick={() => onViewListChange(!isChecked)}
          />
          <span className="Slider" />
        </label>
      </div>
    </div>
  );
};





