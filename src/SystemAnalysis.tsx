import { Button, Divider, Grid2 as Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { getPrediction } from "./api";
import { Result } from "./Result";

export function SystemAnalysis() {
  const [value, setValue] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Grid container rowGap={2}>
        <Grid size={12}>
          <TextField
            variant="filled"
            label="Row Input"
            fullWidth
            name="row_input"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </Grid>
        <Grid size={12}>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                setError(null);
                setLoading(true);
                const p = await getPrediction(JSON.parse(value), "");
                setPrediction(p);
              } catch (e) {
                setError(e);
              } finally {
                setLoading(false);
              }
            }}
          >
            Analyze
          </Button>
        </Grid>
      </Grid>
      <br />
      <Divider />
      <br />

      <Result prediction={prediction} error={error} loading={loading} />
    </>
  );
}
