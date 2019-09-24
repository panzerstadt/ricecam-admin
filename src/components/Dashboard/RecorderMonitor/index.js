import React, { useState, useEffect } from "react";

import styles from "./index.module.css";

import { pullAppStateFromDB } from "../../Database";

const RecorderMonitor = () => {
  const [recorderState, setRecorderState] = useState({});
  useEffect(() => {
    const getRecorderState = async () => {
      const res = await pullAppStateFromDB();
      setRecorderState(res);
    };
    getRecorderState();
  }, []);

  const recState = Object.keys(recorderState).map((v, i) => {
    return (
      <tr key={i}>
        <td>{v}</td>
        <td>{`${recorderState[v]}`}</td>
      </tr>
    );
  });

  return (
    <div className={styles.recorderMonitorContainer}>
      <table className={styles.listTable}>
        <thead>
          <tr>
            <td>
              <h3>video recorder settings</h3>
            </td>
          </tr>
        </thead>
        <tbody>{recState}</tbody>
      </table>
    </div>
  );
};

export default RecorderMonitor;
