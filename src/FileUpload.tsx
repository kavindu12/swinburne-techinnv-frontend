import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
  return (
    <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={async (event) => {
          console.log(event.target.files);

          const file = event.target.files?.[0];

          if (file && file.type === "text/csv") {
            const reader = new FileReader();
            reader.onload = function (e) {
              const result = String(e.target?.result);
              const { content } = parseCSV(result);
              console.log(content);

              const myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");

              fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({
                  input: [content[0]],
                }),
                headers: myHeaders,
              })
                .then((res: Response) => res.json())
                .then(console.log);
            };
            reader.onerror = function (e) {
              console.error("Error reading file", e);
            };
            reader.readAsText(file);
          }
        }}
      />
    </Button>
  );
}
