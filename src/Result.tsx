import { Box, CircularProgress, Typography } from "@mui/material";

export function Result(props: any) {
  const { prediction, error, loading } = props;

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <pre>
        An error occurred:
        <code>{JSON.stringify(error.message, null, 2)}</code>
      </pre>
    );
  }

  if (!prediction) {
    return "[System Analysis result will be displayed here...]";
  }

  if (!(+prediction.predicted_class >= 0)) {
    return (
      <pre>
        An error occurred:
        <code>{JSON.stringify(prediction, null, 2)}</code>
      </pre>
    );
  }

  return (
    <Box>
      <Typography fontSize={20}>
        <strong>Predicted Class ID:</strong> {prediction.predicted_class}
      </Typography>
      <Typography fontSize={20}>
        <strong>Predicted Class Name:</strong> {prediction.class_label}
      </Typography>
    </Box>
  );
}
