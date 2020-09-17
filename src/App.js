import React, { useState } from "react";
import "./styles.css";
import { data } from "../data/usd-gdp.json";

export default function App() {
  return (
    <div className="App">
      <Header />
      <Screen />
    </div>
  );
}

function Screen() {
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const fd = data.filter((d) => {
    if (!filterFrom && !filterTo) {
      return d;
    } else if (!filterFrom) {
      return parseInt(d[0].substring(0, 4)) <= filterTo;
    } else if (!filterTo) {
      return parseInt(d[0].substring(0, 4)) >= filterFrom;
    } else {
      return (
        parseInt(d[0].substring(0, 4)) <= filterTo &&
        parseInt(d[0].substring(0, 4)) >= filterFrom
      );
    }
  });

  return (
    <div>
      <Barchart data={fd} />
      <Filter
        from={filterFrom}
        to={filterTo}
        handleTo={(str) => setFilterTo(str)}
        handleFrom={(str) => setFilterFrom(str)}
      />
    </div>
  );
}

function Filter(props) {
  let warning = "";
  if (props.to < props.from && props.to !== "") {
    warning = (
      <p className="warning">
        First value must be smaller than the second value!!
      </p>
    );
  }
  return (
    <div className="filter">
      <p>Filter chart by year</p>
      <input
        type="number"
        placeholder="From"
        value={props.from}
        onChange={(e) => props.handleFrom(e.target.value)}
      />
      <input
        type="number"
        placeholder="To"
        value={props.to}
        onChange={(e) => props.handleTo(e.target.value)}
      />
      {warning}
    </div>
  );
}

function Barchart(props) {
  const { data } = props;

  const [legend, setLegend] = useState({
    date: "",
    data: -1,
    isHidden: true
  });

  function onLegendChange(obj) {
    setLegend(obj);
  }

  let maxd = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i][1] > maxd) {
      maxd = data[i][1];
    }
  }

  const chartcss = {
    width: 830,
    height: 260
  };

  const bars = data.map((d, i) => {
    const w = parseInt((chartcss.width - 5) / data.length);
    const surplusWidth = ((chartcss.width - 5) % data.length) / data.length;
    const ctrans = "translate(" + i * (w + surplusWidth) + "px, 0px)";
    const css = {
      transform: ctrans,
      width: w,
      height: (d[1] / maxd) * (chartcss.height - 10)
    };
    return (
      <Bar
        key={"bar" + i}
        css={css}
        date={d[0]}
        data={d[1]}
        handleLegend={onLegendChange}
      />
    );
  });

  return (
    <div className="bar-chart" style={chartcss}>
      {bars}
      <Legend legend={legend} />
    </div>
  );
}

function Bar(props) {
  return (
    <div
      className="bar"
      style={props.css}
      onMouseEnter={() =>
        props.handleLegend({
          data: props.data,
          date: props.date,
          isHidden: false
        })
      }
      onMouseLeave={() =>
        props.handleLegend({
          data: props.data,
          date: props.date,
          isHidden: true
        })
      }
    />
  );
}

function Legend(props) {
  const { data } = props.legend;
  const { date } = props.legend;
  const { isHidden } = props.legend;

  const style = {
    display: isHidden ? "none" : "inline-block"
  };

  return (
    <div className="legend" style={style}>
      <p>Date: {date}</p>
      <p>GDP: {data}</p>
    </div>
  );
}

function Header() {
  return <h1>US GDP Data Barchart</h1>;
}
