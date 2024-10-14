import { useMemo } from "react";
import { predictedClassesList, predictedClassLabels, useRecords } from "./api";
import { groupBy } from "lodash-es";
import { lastXMinutes, marks } from "./GaugeCharts";
import { Alert, Box, Typography } from "@mui/material";

function AlertMessage({ count, title }: { title: string; count: number }) {
  let severity: any = "";
  if (count > marks[2]) {
    severity = "error";
  } else if (count > marks[1]) {
    severity = "warning";
  } else {
    return null;
  }

  return (
    <Alert severity={severity}>
      The count of "{title}" type attacks has exceeded the {severity} limit. Currently at {count}
    </Alert>
  );
}

export function Alerts() {
  const relative = lastXMinutes(2);
  const [records] = useRecords();

  const groupedRecords = useMemo(() => {
    const filtered = records.filter((d: any) => {
      return new Date().getTime() - new Date(d.timestamp).getTime() < relative;
    });
    return groupBy(filtered, "predicted_class");
  }, [records]);

  return (
    <>
      <Typography variant="h5" mb="1rem" fontWeight="bold">
        Attack threshold related alerts
      </Typography>
      <Box component="ul" pl="0">
        {predictedClassesList
          .map((predictedClass) => {
            const count = groupedRecords[predictedClass]?.length;
            const label = predictedClassLabels[predictedClass];

            if (!(count > 0) || count < marks[1]) {
              return false;
            }

            return (
              <Box component="li" sx={{ listStyle: "none" }} mb="0.5rem">
                <AlertMessage title={label} count={count} />
              </Box>
            );
          })
          .filter(Boolean)}
      </Box>
    </>
  );
}
