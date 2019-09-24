import React, { useState, useEffect } from "react";

import Timelapse from "../Timelapse";
import Status from "../Status";

import { grabListOfVideoPaths } from "../../Database";
import { downloadMultiple, download } from "../libs";

import styles from "./index.module.css";

const VideoList = ({ date = "2019-07-08" }) => {
  // toggle preview
  const [showPreview, setShowPreview] = useState(false);
  // status reporting
  const [statuses, setStatus] = useState([]);
  const handleStatus = statusText => {
    setStatus(p => [...p.slice(-5), statusText]);
  };
  // create timelapse
  const [createTimelapse, setCreateTimelapse] = useState(false);

  // list videos from db
  const [vlist, setVlist] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const d = "YYYY-MM-DD";
    setLoading(true);
    handleStatus(`loading videos for date: ${date}`);

    grabListOfVideoPaths(date)
      .then(v => {
        v && setVlist(v);
        setLoading(false);
        handleStatus(`videos loaded for date: ${date}`);
      })
      .catch(e => {
        setLoading(false);
        handleStatus(`videos loaded error: ${JSON.stringify(e)}`);
      });
  }, [date]);

  const videoCount =
    vlist.length > 0
      ? vlist.filter(v => {
          const test = v.src && v.src !== "video not found";
          return test;
        }).length
      : 0;

  // store a list of indices you want to delete. order doesn't matter
  const [vlistChecked, setVlistChecked] = useState([]);
  const [numSelected, setNumSelected] = useState();
  useEffect(() => {
    setVlistChecked(Array.from(vlist, () => false));
  }, [vlist]);

  useEffect(() => {
    setNumSelected(vlistChecked.filter(v => v === true).length);
  }, [vlistChecked]);

  const handleCheckbox = (bool, i) => {
    let newList = vlistChecked.slice(0);
    newList[i] = bool;
    setVlistChecked(newList);
  };

  const [subset, setSubset] = useState([]);
  useEffect(() => {
    if (vlist.length > 0 && numSelected > 0) {
      console.log("setting subset");
      setSubset(vlist.filter((v, i) => vlistChecked[i]));
    }
  }, [vlist, vlistChecked, numSelected]);

  return (
    <>
      <div style={{ textAlign: "left", margin: "0 30px" }}>
        <br />

        <h4 style={{ margin: "0 0 8px 0" }}>
          current list of videos on {date}:{" "}
          <span
            style={{
              color:
                videoCount === vlist.length && videoCount ? "black" : "orange"
            }}
          >
            {videoCount} (storage) / {vlist.length} (db){" "}
          </span>
        </h4>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <button onClick={() => setShowPreview(!showPreview)}>
              preview video
            </button>{" "}
            <button
              onClick={() => setCreateTimelapse(!createTimelapse)}
              style={{ backgroundColor: createTimelapse ? "red" : "" }}
            >
              preview timelapse
            </button>
          </div>

          <div>
            <button
              style={{
                color: numSelected === 0 ? "lightgray" : "",
                pointerEvents: numSelected === 0 ? "none" : "all"
              }}
              onClick={() =>
                downloadMultiple(
                  vlist.filter((v, i) => vlistChecked[i]),
                  handleStatus
                )
              }
            >
              DOWNLOAD {numSelected}
            </button>{" "}
            <button onClick={() => downloadMultiple(vlist, handleStatus)}>
              DOWNLOAD ALL
            </button>
          </div>
        </div>
        <br />
      </div>

      <Timelapse data={subset} status={handleStatus} run={createTimelapse} />
      <br />
      <Status statuses={statuses} date={date} />

      {(showPreview || createTimelapse) && (
        <h4 style={{ color: "red" }}>
          WARNING: video and timelapse previews count towards download quota of
          1GB/day
        </h4>
      )}

      <div
        style={{
          textAlign: "left",
          margin: "0 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h4>videos selected: {numSelected}</h4>
        <div>
          <button onClick={() => setVlistChecked(p => p.map(() => false))}>
            select none
          </button>{" "}
          <button onClick={() => setVlistChecked(p => p.map(() => true))}>
            select all
          </button>
        </div>
      </div>

      <div
        style={{
          border: "1px solid black",
          borderRadius: 8,
          minHeight: 50,
          margin: "0 30px"
        }}
      >
        <div className={styles.videoGrid}>
          {vlist.map((v, i) => {
            if (!v.src || v.src === "video not found") return null;
            return (
              <div
                key={v.name}
                style={{ margin: "20px 5px 0", position: "relative" }}
              >
                {!showPreview ? (
                  <div style={{ position: "relative" }}>
                    <a href={v.src}>{v.name}</a>
                    <input
                      name="isSelected"
                      type="checkbox"
                      className={styles.checkboxSimple}
                      checked={vlistChecked[i] || false}
                      onChange={e => handleCheckbox(e.target.checked, i)}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      position: "relative",
                      width: 400,
                      margin: "0 auto"
                    }}
                  >
                    <video
                      height={400}
                      controls
                      autoPlay
                      playsInline
                      loop
                      muted
                    >
                      <source src={v.src} type="video/webm" />
                    </video>
                    <small className={styles.videoName}>{v.name}</small>
                    <input
                      name="isSelected"
                      type="checkbox"
                      className={styles.checkbox}
                      checked={vlistChecked[i] || false}
                      onChange={e => handleCheckbox(e.target.checked, i)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default VideoList;
