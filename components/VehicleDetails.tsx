import React, { FunctionComponent } from "react";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

type Props = {
  setLicensePlate: (model: string) => void;
  setMake: (model: string) => void;
  setModel: (model: string) => void;
  setYear: (year: Dayjs) => void;
  setColor: (color: string) => void;
  editMode: boolean;
  licenseplate: string;
  make: string;
  model: string;
  year: Dayjs;
  color: string;
};

export const VehicleDetails: FunctionComponent<Props> = ({
  setLicensePlate,
  setMake,
  setModel,
  setYear,
  editMode,
  setColor,
  color,
  make,
  model,
  year,
  licenseplate,
}) => (
  <div>
    {editMode ? (
      <>
        <TextField
          required
          fullWidth
          label="Make"
          variant="standard"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />
        <br />
        <TextField
          required
          fullWidth
          label="Model"
          variant="standard"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <br />
        <br />
        <div style={{ width: "100%" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year"]}
              label="Year"
              slotProps={{ textField: { fullWidth: true } }}
              value={dayjs(year)}
              maxDate={dayjs(new Date())}
              minDate={dayjs(new Date("1900-01-01"))}
              defaultValue={null}
              onChange={(value) => {
                setYear(dayjs(value));
                console.log(value?.toString);
              }}
            />
          </LocalizationProvider>
        </div>
        <br />
        <br />
        <FormControl fullWidth>
          <InputLabel id="color-select-label">Color</InputLabel>
          <Select
            labelId="color-select-label"
            value={color}
            required
            label="Color"
            onChange={(e) => setColor(e.target.value)}
          >
            <MenuItem value={"White"}>White</MenuItem>
            <MenuItem value={"Black"}>Black</MenuItem>
            <MenuItem value={"Gray"}>Gray</MenuItem>
            <MenuItem value={"Silver"}>Silver</MenuItem>
            <MenuItem value={"Blue"}>Blue</MenuItem>
            <MenuItem value={"Red"}>Red</MenuItem>
            <MenuItem value={"Brown"}>Brown</MenuItem>
            <MenuItem value={"Green"}>Green</MenuItem>
            <MenuItem value={"Orange"}>Orange</MenuItem>
            <MenuItem value={"Beige"}>Beige</MenuItem>
            <MenuItem value={"Purple"}>Purple</MenuItem>
            <MenuItem value={"Gold"}>Gold</MenuItem>
            <MenuItem value={"Yellow"}>Yellow</MenuItem>
          </Select>
        </FormControl>
        <br />
        <TextField
          required
          label="License Plate"
          variant="standard"
          fullWidth
          value={licenseplate}
          onChange={(e) => setLicensePlate(e.target.value)}
        />
      </>
    ) : (
      <>
        <>{make}</>
        <br />
        <>{model}</>
        <br />
        <>{dayjs(year).year()}</>
        <br />
        <>{color}</>
        <br />
        <>{licenseplate}</>
      </>
    )}
  </div>
);
