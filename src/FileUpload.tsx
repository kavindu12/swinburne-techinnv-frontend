import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import { CircularProgress, Divider, LinearProgress, Typography } from "@mui/material";
import { getPrediction } from "./api";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function parseCSV(csvString: string) {
  // Split the CSV string into lines
  const lines = csvString.trim().split("\n");
  // Extract the headers from the first line
  const headers = lines[0].split(",");
  // Initialize an array to hold the content rows
  const content = [];
  // Iterate over each line after the header line
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((s) => +s);
    content.push(row);
  }
  // Return the headers and content as an object
  return {
    headers,
    content,
  };
}

export default function InputFileUpload() {
  const [status, setStatus] = useState("INIT");
  const [progress, setProgress] = useState(0);

  return (
    <>
      <Typography variant="h5" fontWeight="bold">
        Upload raw data
      </Typography>
      <Typography variant="h6" mb="1rem">
        Run attack category predictions in bulk
      </Typography>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{
          mb: "1rem",
        }}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          onChange={async (event) => {
            const file = event.target.files?.[0];

            if (file && file.type === "text/csv") {
              const reader = new FileReader();
              reader.onload = async function (e) {
                const result = String(e.target?.result);
                const { content } = parseCSV(result);

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                setStatus("LOADING");
                setProgress(0);

                let index = 0;
                try {
                  for (const item of content) {
                    index++;
                    setProgress((index * 100) / content.length);
                    await getPrediction(item, file.name);
                  }
                } catch (e) {
                  // do nothing
                }

                event.target.value = "";

                setProgress(100);
                setStatus("DONE");
              };

              reader.onerror = function (e) {
                console.error("Error reading file", e);
              };
              reader.readAsText(file);
            }
          }}
        />
      </Button>
      <Divider sx={{ mb: "1rem" }} />
      {status === "LOADING" && (
        <LinearProgress sx={{ pt: "1rem" }} variant="determinate" value={progress} color="success" />
      )}
      {status === "DONE" && (
        <Typography>Predictions ran successfully. Head over to the predictions table to see the results</Typography>
      )}
    </>
  );
}
