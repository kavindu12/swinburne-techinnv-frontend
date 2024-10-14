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
      <Typography variant="h5" mb="1rem" fontWeight="bold">
        Analyse raw entry
      </Typography>
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
            sx={{ mb: "1rem" }}
            variant="contained"
            onClick={async () => {
              try {
                setError(null);
                setLoading(true);
                const p = await getPrediction(JSON.parse(value), "MANUAL_ENTRY");
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
          <Typography variant="caption" display="block" lineHeight="1">
            Try this example:
            <pre>
              <code>
                [[0.5,1.2,3.3,4.1,2.9,1,0.8,1.3,0.7,2.1,3,0.6,1.7,2.3,3.4,1.8,0.9,2.2,5.4,1.5,2.8,0.3,1.6,2,0.2,3.2,1.9,0.1,1.4,2.6,0,1.1,11.7]]
              </code>
            </pre>
          </Typography>
        </Grid>
      </Grid>
      <br />
      <Divider />
      <br />

      <Result prediction={prediction} error={error} loading={loading} />
    </>
  );
}
