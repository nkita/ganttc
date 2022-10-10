import React from 'react';
import { Button, ButtonGroup } from 'rsuite';
import { ViewMode } from "@nkita/gantt-task-react";
import styles from "./index.module.css";

type PeriodSwitcherProps = {
  isViewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
};

export const PeriodSwitch: React.FC<PeriodSwitcherProps> = ({
  onViewModeChange,
  isViewMode,
}) => {
  const CustomButton: React.FC<{ mode: ViewMode, label: string }> = ({ mode, label }) => {
    return (
      <Button
        appearance={
          (isViewMode === mode) ? "primary" : "ghost"}
        onClick={() => { onViewModeChange(mode) }}
      >
        {label}
      </Button>
    )
  };

  return (
    <ButtonGroup size="xs" className={styles.buttonGroup}>
      <CustomButton mode={ViewMode.Day} label={"日"} />
      <CustomButton mode={ViewMode.Week} label={"週"} />
      <CustomButton mode={ViewMode.Month} label={"月"} />
    </ButtonGroup >
  );
};
