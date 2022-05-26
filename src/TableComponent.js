import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Table } from "antd";
import moment from "moment";

function TableComponent() {
  const [apiData, setApiData] = useState([]);
  const [timeStamp, setTimeStamp] = useState();

  useEffect(() => {
    getPSI();
  }, []);

  const getPSI = async () => {
    await Axios.get("https://api.data.gov.sg/v1/environment/psi").then(
      (result) => {
        setTimeStamp(result.data.items[0].timestamp);

        let keysArray = Object.keys(result.data.items[0].readings);
        const metric_column = keysArray.map((item) => ({ metric: item }));
        const psi_columns = Object.values(result.data.items[0].readings);

        let table_data = metric_column.map((item, i) =>
          Object.assign({}, item, psi_columns[i])
        );

        setApiData(table_data);
      }
    );
  };

  const columns = [
    {
      title: "Metric",
      dataIndex: "metric",
    },
    {
      title: "Region",
      children: [
        {
          title: "National",
          dataIndex: "national",
        },
        {
          title: "Central",
          dataIndex: "central",
        },
        {
          title: "West",
          dataIndex: "west",
        },
        {
          title: "East",
          dataIndex: "east",
        },
        {
          title: "North",
          dataIndex: "north",
        },
        {
          title: "South",
          dataIndex: "south",
        },
      ],
    },
  ];

  return (
    <div>
      <center>
        <br />
        <h1 style={{ color: "#292929" }}>
          NEA Pollutant Standards Index (PSI) Readings
        </h1>
        <h3 style={{ color: "#292929" }}>
          Last Updated {moment(timeStamp).format("MMMM Do YYYY, h:mm:ss a")}
        </h3>
        <br />

        <div style={{ width: "80%" }}>
          <Table
            size="medium"
            columns={columns}
            dataSource={apiData}
            pagination={{ pageSize: 15 }}
          ></Table>
        </div>
      </center>
    </div>
  );
}

export default TableComponent;
