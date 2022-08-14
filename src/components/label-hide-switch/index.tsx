import React from 'react';
// import { Toggle } from 'rsuite';
import { IconButton } from 'rsuite';
import MenuIcon from '@rsuite/icons/Menu';

type TaskListSwitcherProps = {
  isChecked: boolean;
  onViewListChange: (isChecked: boolean) => void;
};

export const LabelHideSwitch: React.FC<TaskListSwitcherProps> = ({
  onViewListChange,
  isChecked,
}) => {
  return (
    <span
      onClick={() => onViewListChange(!isChecked)}
    >
      <IconButton icon={<MenuIcon />} circle size="md" appearance="subtle" />
    </span>
  );
};





