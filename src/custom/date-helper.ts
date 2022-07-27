
import { ViewMode } from "gantt-task-react";

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