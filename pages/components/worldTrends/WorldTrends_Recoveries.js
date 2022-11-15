import * as React from "react";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Select, Box, Text } from "@chakra-ui/react";
import { colors } from "../../../styles/colors.js";

import { csv } from "csvtojson";

export default function WorldTrends_Recoveries() {
  const [data, setData] = useState([]);
  const [filterLocation, setFilterLocation] = useState("Uganda"); // change to "World" to default to world

  useEffect(() => {
    const url =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQelcvFosb_CZfKBlXr4C-n8xXGb7oPalH7tPJwLWbQynuu5vY2UW9sADUTPXoodmTq3eF6fvjbBLnG/pub?gid=0&single=true&output=csv";

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const text = await res.text();
        const jsonArray = await csv().fromString(text);
        setData(jsonArray);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  const nonUniqueLocationOptions = JSON.parse(
    JSON.stringify(
      data.map((y) => {
        return y["location"];
      })
    )
  );
  const uniqueLocationOptions = [...new Set(nonUniqueLocationOptions)];
  const filter = data.filter((x) => x.location === filterLocation);
  const filteredDates = JSON.parse(
    JSON.stringify(
      filter.map((y) => {
        return y["date"];
      })
    )
  );
  const filteredTotalRecovered = JSON.parse(
    JSON.stringify(
      filter.map((y) => {
        return Math.max(y["total_recovered"]);
      })
    )
  );

  const chartData = {
    labels: filteredDates,
    datasets: [
      {
        label: "Recovered",
        fill: false,
        lineTension: 0.1,
        backgroundColor: colors.cadmiumOrange,
        borderColor: colors.cadmiumOrange,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.cadmiumOrange,
        pointBackgroundColor: colors.cadmiumOrange,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.cadmiumOrange,
        pointHoverBorderColor: colors.cadmiumOrange,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: filteredTotalRecovered,
      },
    ],
  };

  return (
    <>
      <Box mt={2} mb={2}>
        {/* 
        <Select onChange={(e) => setFilterLocation(e.target.value)}>
  
          <option defaultValue={"World"}>World</option>
    
          {uniqueLocationOptions &&
            uniqueLocationOptions.map((location) => (
              <option value={location} key={location}>
                {location}
              </option>
            ))}
        </Select>      */}

        <div style={{ minHeight: "35vh" }}>
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </Box>
    </>
  );
}
