import React from 'react';
import { Toggle } from 'rsuite';

type TaskListSwitcherProps = {
  isChecked: boolean;
  onViewListChange: (isChecked: boolean) => void;
};

export const TaskListSwitcher: React.FC<TaskListSwitcherProps> = ({
  onViewListChange,
  isChecked,
}) => {
  return (
    <Toggle
      defaultChecked={isChecked}
      onClick={() => onViewListChange(!isChecked)}
    />
  );
};





