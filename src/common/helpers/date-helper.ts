
import { ViewMode,Task } from "@nkita/gantt-task-react";

type DateHelperScales =
    | "year"
    | "month"
    | "day"
    | "hour"
    | "minute"
    | "second"
    | "millisecond";

export const seedDates = (
    startDate: Date,
    endDate: Date,
    viewMode: ViewMode
) => {
    let currentDate: Date = new Date(startDate);
    const dates: Date[] = [currentDate];
    while (currentDate < endDate) {
        switch (viewMode) {
            case ViewMode.Month:
                currentDate = addToDate(currentDate, 1, "month");
                break;
            case ViewMode.Week:
                currentDate = addToDate(currentDate, 7, "day");
                break;
            case ViewMode.Day:
                currentDate = addToDate(currentDate, 1, "day");
                break;
            case ViewMode.HalfDay:
                currentDate = addToDate(currentDate, 12, "hour");
                break;
            case ViewMode.QuarterDay:
                currentDate = addToDate(currentDate, 6, "hour");
                break;
            case ViewMode.Hour:
                currentDate = addToDate(currentDate, 1, "hour");
                break;
        }
        dates.push(currentDate);
    }
    return dates;
};

export const addToDate = (
    date: Date,
    quantity: number,
    scale: DateHelperScales
) => {
    const newDate = new Date(
        date.getFullYear() + (scale === "year" ? quantity : 0),
        date.getMonth() + (scale === "month" ? quantity : 0),
        date.getDate() + (scale === "day" ? quantity : 0),
        date.getHours() + (scale === "hour" ? quantity : 0),
        date.getMinutes() + (scale === "minute" ? quantity : 0),
        date.getSeconds() + (scale === "second" ? quantity : 0),
        date.getMilliseconds() + (scale === "millisecond" ? quantity : 0)
    );
    return newDate;
};

export const startOfDate = (date: Date, scale: DateHelperScales) => {
    const scores = [
        "millisecond",
        "second",
        "minute",
        "hour",
        "day",
        "month",
        "year",
    ];

    const shouldReset = (_scale: DateHelperScales) => {
        const maxScore = scores.indexOf(scale);
        return scores.indexOf(_scale) <= maxScore;
    };
    const newDate = new Date(
        date.getFullYear(),
        shouldReset("year") ? 0 : date.getMonth(),
        shouldReset("month") ? 1 : date.getDate(),
        shouldReset("day") ? 0 : date.getHours(),
        shouldReset("hour") ? 0 : date.getMinutes(),
        shouldReset("minute") ? 0 : date.getSeconds(),
        shouldReset("second") ? 0 : date.getMilliseconds()
    );
    return newDate;
};

export const ganttDateRange = (tasks: Task[], viewMode: ViewMode) => {
    let newStartDate: Date = tasks[0].start;
    let newEndDate: Date = tasks[0].start;
    for (const task of tasks) {
        if (task.start < newStartDate) {
            newStartDate = task.start;
        }
        if (task.end > newEndDate) {
            newEndDate = task.end;
        }
    }
    switch (viewMode) {
        case ViewMode.Month:
            newStartDate = addToDate(newStartDate, -1, "month");
            newStartDate = startOfDate(newStartDate, "month");
            newEndDate = addToDate(newEndDate, 1, "year");
            newEndDate = startOfDate(newEndDate, "year");
            break;
        case ViewMode.Week:
            newStartDate = startOfDate(newStartDate, "day");
            newEndDate = startOfDate(newEndDate, "day");
            newStartDate = addToDate(getMonday(newStartDate), -7, "day");
            newEndDate = addToDate(newEndDate, 1.5, "month");
            break;
        case ViewMode.Day:
            newStartDate = startOfDate(newStartDate, "day");
            newEndDate = startOfDate(newEndDate, "day");
            newStartDate = addToDate(newStartDate, -1, "day");
            newEndDate = addToDate(newEndDate, 19, "day");
            break;
        case ViewMode.QuarterDay:
            newStartDate = startOfDate(newStartDate, "day");
            newEndDate = startOfDate(newEndDate, "day");
            newStartDate = addToDate(newStartDate, -1, "day");
            newEndDate = addToDate(newEndDate, 66, "hour"); // 24(1 day)*3 - 6
            break;
        case ViewMode.HalfDay:
            newStartDate = startOfDate(newStartDate, "day");
            newEndDate = startOfDate(newEndDate, "day");
            newStartDate = addToDate(newStartDate, -1, "day");
            newEndDate = addToDate(newEndDate, 108, "hour"); // 24(1 day)*5 - 12
            break;
        case ViewMode.Hour:
            newStartDate = startOfDate(newStartDate, "hour");
            newEndDate = startOfDate(newEndDate, "day");
            newStartDate = addToDate(newStartDate, -1, "hour");
            newEndDate = addToDate(newEndDate, 1, "day");
            break;
    }
    return [newStartDate, newEndDate];
};

/**
* Returns monday of current week
* @param date date for modify
*/
const getMonday = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
};