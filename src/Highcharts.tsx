import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ChartModuleMore from "highcharts/highcharts-more.js";
import HCSoldGauge from "highcharts/modules/solid-gauge";
import { Box } from "@mui/material";
import { getResults } from "./api";

ChartModuleMore(Highcharts);
HCSoldGauge(Highcharts);

const marks = [0, 20, 30, 50];

const getOptions = (val = 0, title = "") => ({
  chart: {
    type: "gauge",
    plotBackgroundColor: null,
    plotBackgroundImage: null,
    plotBorderWidth: 0,
    plotShadow: false,
    height: "80%",
  },

  title: {
    text: title,
  },

  pane: {
    startAngle: -90,
    endAngle: 89.9,
    background: null,
    center: ["50%", "75%"],
    size: "110%",
  },

  // the value axis
  yAxis: {
    min: marks[0],
    max: marks[3],
    tickPixelInterval: 72,
    tickPosition: "inside",
    tickColor: Highcharts.defaultOptions.chart?.backgroundColor || "#FFFFFF",
    tickLength: 20,
    tickWidth: 2,
    minorTickInterval: null,
    labels: {
      distance: 20,
      style: {
        fontSize: "14px",
      },
    },
    lineWidth: 0,
    plotBands: [
      {
        from: marks[0],
        to: marks[1],
        color: "#55BF3B", // green
        thickness: 20,
        borderRadius: "50%",
      },
      {
        from: marks[1],
        to: marks[2],
        color: "#DDDF0D", // yellow
        thickness: 20,
      },
      {
        from: marks[2],
        to: marks[3],
        color: "#DF5353", // red
        thickness: 20,
        borderRadius: "50%",
      },
    ],
  },

  series: [
    {
      name: "Attack count",
      data: [val],
      tooltip: {
        valueSuffix: " attacks",
      },
      dataLabels: {
        format: "{y} attacks",
        borderWidth: 0,
        color:
          (Highcharts.defaultOptions.title &&
            Highcharts.defaultOptions.title.style &&
            Highcharts.defaultOptions.title.style.color) ||
          "#333333",
        style: {
          fontSize: "16px",
        },
      },
      dial: {
        radius: "80%",
        backgroundColor: "gray",
        baseWidth: 12,
        baseLength: "0%",
        rearLength: "0%",
      },
      pivot: {
        backgroundColor: "gray",
        radius: 6,
      },
    },
  ],
});

const lastXMinutes = (x: number): number => x * 60 * 1000;

export function AlertCountInLastXMinutes(props: any) {
  const { relative = lastXMinutes(5) } = props;

  const [options, setOptions] = useState(() => getOptions());

  useEffect(() => {
    const i = setInterval(async () => {
      const data = await getResults();
      const filtered = data.filter((d: any) => {
        return new Date().getTime() - new Date(d.timestamp).getTime() < relative;
      });

      console.log(filtered.length);

      setOptions(getOptions(filtered.length));
    }, 3000);

    return () => clearInterval(i);
  }, []);

  return (
    <Box width="800px">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
}
