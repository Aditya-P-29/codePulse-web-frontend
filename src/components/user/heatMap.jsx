import React from "react";

import HeatMap from "@uiw/react-heat-map";

import { useState, useEffect } from "react";

//funcition to generate random activity

const generateActivity = (startDate, endDate) => {
  const data = []; //intitialize an empty array

  const currentDate = new Date(startDate);

  const end = new Date(endDate);

  while (currentDate <= end) {
    const count = Math.floor(Math.random() * 50);

    data.push({
      date: currentDate.toISOString().split("T")[0], //streak

      count: count, //count of activity
    });

    currentDate.setDate(currentDate.getDate() + 1); //increment the date by 1 day
  }

  return data;
};

//colors

const getPanelColors = (maxCount) => {
  const colors = [];

  for (let i = 0; i <= maxCount; i++) {
    const greenValue = Math.floor((i / maxCount) * 255);

    colors[i] = `rgb(0, ${greenValue}, 0)`;
  }

  return colors;
};

function heatMap() {
  const [activityData, setActivityData] = useState([]);

  const [panelColors, setPanelColors] = useState({});

  useEffect(() => {
    //in future we will fetch data from the database

    const fetchData = async () => {
      // Contribution points only through May; Jun–Dec omitted so those days stay empty.

      const data = generateActivity("2026-01-01", "2026-05-31");

      setActivityData(data);

      const maxCount = Math.max(...data.map((item) => item.count));

      setPanelColors(getPanelColors(maxCount));
    };

    fetchData();
  }, []);

  return (
    <div
      className="github-contrib-surface rounded-md border border-[#30363d] bg-[#0d1117] p-5 text-[13px]"
      style={{ color: "#8b949e" }}
    >
      <style>{`

          .github-contrib-surface svg {

            overflow: visible;

            color-scheme: dark;

          }



          .github-contrib-surface .w-heatmap-week,

          .github-contrib-surface svg text:not([fill]) {

            fill: #8b949e;

            font-size: 10px;

          }

        `}</style>

      <h4 className="mb-4 text-sm font-normal leading-snug text-[#c9d1d9]">
        Recent contributions
      </h4>

      <div
        className="w-full pb-1 max-[1100px]:overflow-x-auto min-[1101px]:overflow-x-visible"
        style={{ minHeight: "9.5rem" }}
      >
        <div className="w-full min-w-[1000px] min-[1100px]:min-w-full">
          <HeatMap
            className="block h-auto w-full max-w-none [&_svg]:block [&_svg]:h-auto [&_svg]:min-w-[1000px] [&_svg]:w-full [&_svg]:max-w-none min-[1100px]:[&_svg]:min-w-full"
            style={{
              color: "#8b949e",

              display: "block",

              colorScheme: "dark",

              width: "100%",

              /* Empty / no-contribution tiles (neutral gray on dark bg) */
              "--rhm-rect": "#4d5560",

              "--rhm-text-color": "#8b949e",
            }}
            value={activityData}
            weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
            monthLabels={[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ]}
            startDate={new Date("2026-01-01")}
            endDate={new Date("2026-12-31")}
            rectSize={15}
            space={3}
            rectProps={{
              rx: 2.5,
            }}
            legendCellSize={0}
            panelColors={panelColors}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8b949e]">
        <a
          href="#"
          className="underline decoration-[#8b949e]/40 underline-offset-2 hover:text-[#58a6ff]"
          onClick={(e) => e.preventDefault()}
        >
          Learn how we count contributions
        </a>

        <div className="flex items-center gap-2 shrink-0">
          <span>Less</span>

          <span className="inline-flex gap-[3px]" aria-hidden>
            {["#4d5560", "#0e4429", "#006d32", "#26a641", "#39d353"].map(
              (c) => (
                <span
                  key={c}
                  className="inline-block h-[11px] w-[11px] rounded-[2px] ring-1 ring-[#30363d]"
                  style={{ backgroundColor: c }}
                />
              ),
            )}
          </span>

          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default heatMap;
