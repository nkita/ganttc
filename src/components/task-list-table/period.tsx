import React, { useMemo } from "react";
import styles from "./index.module.css";
import { Task } from "../../common/types/public-types"
import 'rsuite/dist/rsuite.min.css';

const localeDateStringCache: { [key: string]: string } = {};
const toLocaleDateStringFactory =
    (locale: string) =>
        (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
            const key = date.toString();
            let lds = localeDateStringCache[key];
            if (!lds) {
                //　多言語対応
                // lds = date.toLocaleDateString(locale, dateTimeOptions);
                // 日本語用
                lds = date.getMonth() + 1 + "/" + date.getDate();
                localeDateStringCache[key] = lds;
            }
            return lds;
        };
const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
};

export const Period: React.FC<{
    task: Task;
    rowWidth: string;
    locale: string;
}> = ({
    task,
    rowWidth,
    locale,
}) => {
        const toLocaleDateString = useMemo(
            () => toLocaleDateStringFactory(locale),
            [locale]
        );
        return (
            <>
                <div
                    className={styles.taskListCell}
                    style={{
                        minWidth: `${rowWidth}px`,
                        maxWidth: `${rowWidth}px`,
                        textAlign: "center",
                    }}
                >
                    <span>{toLocaleDateString(task.start, dateTimeOptions)}</span>
                    -
                    <span>{toLocaleDateString(task.end, dateTimeOptions)}</span>
                </div>
            </>
        );
    };