import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import { getResults, predictedClassLabels } from "./api";
import { Box, CircularProgress } from "@mui/material";
import { groupBy, map } from "lodash-es";
import { AlertCountInLastXMinutes } from "./Highcharts";

function TimeSeries() {
  return (
    <BarChart
      series={[
        { data: [35, 44, 24, 34] },
        { data: [51, 6, 49, 30] },
        { data: [15, 25, 30, 50] },
        { data: [60, 50, 15, 25] },
      ]}
      width={800}
      height={290}
      xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
}

type SourceItem = {
  filename: string | null;
  id: number;
  predicted_class: number;
  timestamp: string;
};

type ResultItem = {
  id: number;
  value: number;
  label: string;
};

function convertDataForOverallChart(source: SourceItem[]): ResultItem[] {
  // Group the items by predicted_class
  const grouped = groupBy(source, (item) => item.predicted_class);
  // Map the grouped data to the desired format
  const result: ResultItem[] = map(grouped, (items, predictedClass) => {
    return {
      id: parseInt(predictedClass, 10),
      value: items.length,
      label: predictedClassLabels[predictedClass] || "unknown",
    };
  });
  return result;
}

function Overall(props: any) {
  const { data } = props;

  const rows = convertDataForOverallChart(data);

  return (
    <PieChart
      series={[
        {
          data: rows,
        },
      ]}
      width={400}
      height={200}
    />
  );
}

export function Dashboard() {
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
    <>
      {/* <TimeSeries></TimeSeries> */}
      <Overall data={data}></Overall>
      <AlertCountInLastXMinutes />
    </>
  );
}
