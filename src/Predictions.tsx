import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { getResults, predictedClassLabels } from "./api";
import { Box, CircularProgress } from "@mui/material";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "predicted_class",
    headerName: "Prediction",
    valueGetter: (value) => {
      return predictedClassLabels[value] || "unknown";
    },
    width: 250,
  },
  { field: "filename", headerName: "File Name (Optional)", width: 300 },
  {
    field: "timestamp",
    headerName: "Timestamp",
    type: "string",
    width: 300,
  },
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
    <Paper sx={{ height: "70vh", width: "1000px" }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10, 20, 50, 100]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
