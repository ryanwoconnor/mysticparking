import React, { FunctionComponent } from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";
type Props = {
  timeselectincrement: string;
  setTimeSelectIncrement: (increment: string) => void;
  timeSelect: string;
  setTimeSelect: (time: string) => void;
};

export const TimeSelect: FunctionComponent<Props> = ({
  timeselectincrement,
  setTimeSelectIncrement,
  timeSelect,
  setTimeSelect,
}) => (
  <div>
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
      <TextField
        type="number"
        value={timeSelect}
        onChange={(e) => {
          setTimeSelect(String(e.target.value));
        }}
      />

      <Select
        labelId="color-select-label"
        value={timeselectincrement}
        required
        onChange={(e) => {
          setTimeSelectIncrement(e.target.value);
          console.log(e.target.value);
        }}
      >
        <MenuItem value={"Minutes"}>Minutes</MenuItem>
        <MenuItem value={"Hours"}>Hours</MenuItem>
      </Select>
    </ButtonGroup>
  </div>
);
