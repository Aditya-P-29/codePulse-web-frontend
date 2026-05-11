import React from "react";

import HeatMap from "@uiw/react-heat-map";

import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

//colors

const getPanelColors = (maxCount) => {
  const colors = ["#4d5560"];

  if (maxCount <= 0) return colors;

  for (let i = 1; i <= maxCount; i++) {
    const greenValue = Math.floor((i / maxCount) * 255);

    colors[i] = `rgb(0, ${greenValue}, 0)`;
  }

  return colors;
};

function heatMap() {
  const [activityData, setActivityData] = useState([]);

  const [panelColors, setPanelColors] = useState({});

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setActivityData([]);
        setPanelColors(getPanelColors(0));
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/repo/user/${userId}/activity`,
          {
            params: { year: currentYear },
          },
        );

        const data = Array.isArray(response.data?.activity)
          ? response.data.activity
          : [];

        setActivityData(data);

        const maxCount = data.length
          ? Math.max(...data.map((item) => item.count || 0))
          : 0;

        setPanelColors(getPanelColors(maxCount));
      } catch (err) {
        console.error("Error fetching contribution activity:", err);
        setActivityData([]);
        setPanelColors(getPanelColors(0));
      }
    };

    fetchData();
  }, [currentYear]);

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
            startDate={new Date(`${currentYear}-01-01`)}
            endDate={new Date(`${currentYear}-12-31`)}
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
