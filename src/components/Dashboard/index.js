import React, { useState, useEffect } from "react";

import VideoGallery from "./VideoGallery";
import RecorderMonitor from "./RecorderMonitor";

import styles from "./index.module.css";

const Dashboard = () => {
  const [date, setDate] = useState("2019-05-10");
  const [query, setQuery] = useState("2019-05-10");

  const handleUpdateVideoGallery = e => {
    setQuery(date);
    e.preventDefault();
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1>ricecam admin</h1>
      <form onSubmit={handleUpdateVideoGallery}>
        <input
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
