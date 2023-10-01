"use client";
import { VehicleDetails } from "../components/VehicleDetails";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TimeSelect } from "../components/TimeSelect";
import PayNowButton from "../components/PayNowButton";
import { useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import moment from "moment";

// eslint-disable-next-line import/no-unused-modules
export default function Home() {
  const [licenseplate, setLicensePlate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(dayjs(null));
  const [color, setColor] = useState("");

  const [timeSelect, setTimeSelect] = useState("0");
  const [timeselectincrement, setTimeSelectIncrement] = useState("Minutes");
  const [step, setStep] = useState(0);

  const steps = ["Add Vehicle", "Choose Time", "Pay"];
  const { data: session } = useSession();

  const handleStep = (step: number) => () => {
    setStep(step);
  };

  useEffect(() => {
    console.log(session);
  }, [session]);

  if (session) {
    return (
      <div
        style={{
          width: "100%",
          margin: "auto",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h4">Mystic Parking Space</Typography>
        <br />
        <Stepper activeStep={step}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};

            return (
              <Step key={label} {...stepProps}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            );
          })}
        </Stepper>

        {/* <Calendar calendarName={"Downtown Mystic Parking Space"} />*/}
        {step == 0 ? (
          <>
            <br />
            <Typography variant="h5">Tell us about your vehicle</Typography>

            <>
              <VehicleDetails
                setLicensePlate={setLicensePlate}
                setMake={setMake}
                setModel={setModel}
                setYear={setYear}
                setColor={setColor}
                licenseplate={licenseplate}
                make={make}
                model={model}
                year={year}
                color={color}
                editMode={true}
              />{" "}
              <br />
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => {
                  setStep(1);
                }}
                disabled={
                  make == "" ||
                  model == "" ||
                  color == "" ||
                  licenseplate == "" ||
                  !year
                }
              >
                Save Vehicle
              </Button>
            </>
          </>
        ) : (
          <></>
        )}

        <br />
        <br />

        {step == 1 ? (
          <>
            <Typography variant="h5">How long will you be parking?</Typography>
            <br />
            <TimeSelect
              setTimeSelectIncrement={setTimeSelectIncrement}
              timeselectincrement={timeselectincrement}
              timeSelect={timeSelect}
              setTimeSelect={setTimeSelect}
            />
            <br />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => {
                setStep(2);
              }}
              disabled={String(timeSelect) == "0"}
            >
              Set Time
            </Button>
          </>
        ) : (
          <></>
        )}
        <br />
        {step == 2 ? (
          <>
            <Typography variant="h4">Your Parking Information</Typography>
            <VehicleDetails
              setLicensePlate={setLicensePlate}
              setMake={setMake}
              setModel={setModel}
              setYear={setYear}
              setColor={setColor}
              licenseplate={licenseplate}
              make={make}
              model={model}
              year={year}
              color={color}
              editMode={false}
            ></VehicleDetails>
            <p>Start Time: {moment().format("MM/DD/YYYY")}</p>
            <p>
              End Time:
              {moment().format("MM/DD/YYYY")}
            </p>

            <br />
            <Typography variant="h5">How do you want to pay?</Typography>

            <div style={{ margin: "auto", width: "100%" }}>
              <PayNowButton />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  } else {
    return <p>Not Signed In</p>;
  }
}
