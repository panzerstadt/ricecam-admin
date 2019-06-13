import React, { useState, useEffect } from "react";
// timestamps
import dayjs from "dayjs";
import "dayjs/locale/ja";

import styles from "./index.module.css";

import VideoGallery from "./VideoGallery";
import RecorderMonitor from "./RecorderMonitor";
dayjs.locale("ja");

const Dashboard = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const [date, setDate] = useState(today);
  const [query, setQuery] = useState(today);

  const handleUpdateVideoGallery = e => {
    setQuery(date);
    e.preventDefault();
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1>ricecam admin</h1>
      <form onSubmit={handleUpdateVideoGallery}>
        <input
          style={{
            height: 18,
            padding: 5,
            marginRight: 10,
            borderRadius: 5,
            outline: "none",
            border: "1px solid black",
            boxShadow: "1px 2px 5px #08BDBD55"
          }}
          onChange={e => setDate(e.target.value)}
          value={date}
          placeholder="2019-05-08"
        />
        <button type="submit">get videos</button>
      </form>
      <VideoGallery date={query} />
      <RecorderMonitor />
    </div>
  );
};

export default Dashboard;
