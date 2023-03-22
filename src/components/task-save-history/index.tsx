import React from "react";
import { Configuration } from "../../common/types/public-types";
import { v4 as uuidv4 } from 'uuid';



type Props = {
  configs: Configuration[];
};
export const TaskSaveHistory: React.FC<Props> = ({ configs }) => {

  let saveHistory: Configuration[] = []
  if (configs !== undefined) saveHistory = configs;

  return (
    <>
      {saveHistory.length === 0 &&
        <span>保存データはありません。</span>
      }
      {saveHistory.length >= 1 &&
        saveHistory.map((data) => {
          return <li key={uuidv4()}>{data.modifyDate} に保存しました。</li>
        })}
    </>
  );
};
