import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { getResults, predictedClassLabels } from "./api";
import { Box, CircularProgress, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 200 },
  {
    field: "predicted_class",
    headerName: "Prediction",
    valueGetter: (value) => {
      return predictedClassLabels[value] || "unknown";
    },
    width: 300,
  },
  {
    field: "timestamp",
    headerName: "Timestamp",
    type: "string",
    width: 300,
  },
  { field: "filename", headerName: "File Name (Optional)", width: 400 },
];

const paginationModel = { page: 0, pageSize: 20 };

export default function DGrid() {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getResults();
        data.reverse();
        setData(data);
      } catch (e) {
        //
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <div>Loading data...</div>
        <br />
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h5" mb="1rem" fontWeight="bold">
        Attacks history
      </Typography>
      <Paper sx={{ height: "80vh", width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 20, 50, 100]}
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
}
