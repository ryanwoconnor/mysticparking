"use client";
import React, { FunctionComponent } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

type Props = {
  calendarName: string;
};

export const Calendar: FunctionComponent<Props> = ({ calendarName }) => (
  <div>
    <h1>{calendarName}</h1>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker label="Basic date time picker" />
    </LocalizationProvider>
  </div>
);
