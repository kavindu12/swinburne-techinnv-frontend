import { Box, Button, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAtom, atom, useSetAtom } from "jotai";
import { getPrediction } from "./api";
import { Result } from "./Result";
import { csv as dataset } from "./inputs";

const timerAtom = atom(-1);
const runningAtom = atom(false);

function Fetcher(props: any) {
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const prediction = await getPrediction(props.row, "");
        setPrediction(prediction);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [props.row]);

  return <Result prediction={prediction} error={error} loading={loading} />;
}

function Executor() {
  const [nextTick, setNextTick] = useAtom(timerAtom);
  const [running] = useAtom(runningAtom);

  useEffect(() => {
    if (nextTick > 0) {
      const i = setTimeout(
        () => {
          setNextTick(Math.random() * 5 + 2);
        },
        nextTick * 1.5 * 1000,
      );

      return () => clearTimeout(i);
    }
  }, [nextTick]);

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
        <Fetcher row={row} />
      </>
    </>
  );
}

export function Realtime() {
  const setTimer = useSetAtom(timerAtom);
  const [running, setRunning] = useAtom(runningAtom);

  return (
    <>
      <Typography variant="h4">Realtime Attack Prediction</Typography>
      <Typography variant="h5">(Simulation only)</Typography>
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
      <Box mb="1rem" width="100%" />
      <Divider />
      <br />
      <Executor />
    </>
  );
}
