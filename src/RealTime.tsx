import { Box, Button, Divider, FormControlLabel, Switch, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAtom, atom, useSetAtom } from "jotai";
import { getPrediction } from "./api";
import { Result } from "./Result";
import { csv as dataset } from "./inputs";

const timerAtom = atom(-1);
const runningAtom = atom(false);
const predictionAtom = atom(null);
const speedupAtom = atom(false);

export function Simulation() {
  const [nextTick, setNextTick] = useAtom(timerAtom);
  const [running] = useAtom(runningAtom);
  const setPrediction = useSetAtom(predictionAtom);
  const [speedup] = useAtom(speedupAtom);

  const DELAY = speedup ? 0 : 2;
  const SPEED = speedup ? 0.2 : 1.5;

  useEffect(() => {
    if (running && nextTick > 0) {
      const i = setTimeout(
        () => {
          setNextTick(Math.random() * 5 + DELAY);
        },
        nextTick * SPEED * 1000,
      );

      return () => clearTimeout(i);
    }
  }, [running, nextTick]);

  const pos = nextTick > 0 ? Math.floor(Math.random() * dataset.length) : -1;
  const row = dataset[pos];

  useEffect(() => {
    (async () => {
      try {
        const prediction = await getPrediction(row, "ON_DEMAND");
        setPrediction(prediction);
      } catch (e) {}
    })();
  }, [row]);

  return null;
}

function Executor() {
  const [nextTick] = useAtom(timerAtom);
  const [running] = useAtom(runningAtom);
  const [prediction] = useAtom(predictionAtom);

  const pos = nextTick > 0 ? Math.floor(Math.random() * dataset.length) : -1;
  const row = dataset[pos];

  if (!row) {
    if (!running) {
      return null;
    }
    return (
      <>
        <Typography>Listening for requests...!</Typography>
      </>
    );
  }

  return (
    <>
      <>
        <Typography variant="h4">
          <strong>Latest request received</strong>
        </Typography>
        <Typography>{JSON.stringify(row)}</Typography>
        <br />
        <Typography>
          <strong>Timestamp: </strong>
          {new Date().toUTCString()}
        </Typography>
      </>
      <br />
      <>
        <Typography variant="h4">
          <strong>Prediction</strong>
        </Typography>
        <Result prediction={prediction} error={null} loading={false} />
      </>
    </>
  );
}

export function Realtime() {
  const setTimer = useSetAtom(timerAtom);
  const [running, setRunning] = useAtom(runningAtom);
  const [speedup, setSpeedup] = useAtom(speedupAtom);

  return (
    <>
      <Typography variant="h5" fontWeight="bold">
        Realtime Attack Prediction
      </Typography>
      <Typography variant="h6">(Simulation only)</Typography>
      <br />
      <Button
        variant="contained"
        onClick={() => {
          setRunning(!running);
          setTimeout(() => {
            running ? setTimer(-1) : setTimer(1);
          }, 2000);
        }}
      >
        {running ? "Stop Simulation" : "Start Simulation"}
      </Button>
      <FormControlLabel
        sx={{ ml: "1rem" }}
        control={<Switch checked={speedup} onChange={(e) => setSpeedup(e.target.checked)} />}
        label="Speedup simulation"
      />
      <Box mb="1rem" width="100%" />
      <Divider />
      <br />
      <Executor />
    </>
  );
}
