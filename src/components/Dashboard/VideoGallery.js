import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import FileSaver from "file-saver";
import axios from "axios";

import { grabListOfVideoPaths } from "../Database";

import styles from "./VideoGallery.module.css";

const downloadMultiple = async (files, status) => {
  var zip = new JSZip();
  // zip.file("Hello.txt", "Hello World\n");
  // var img = zip.folder("images");
  // img.file("smile.gif", imgData, { base64: true });

  const promises = [];

  files.map(async (v, i) => {
    status && status(`item no.${i + 1} - performing GET requests`);
    promises.push(
      axios({ method: "get", url: v.src, responseType: "blob" })
        .then(response => {
          status &&
            status(`item no.${i + 1} - download complete. adding to zip file`);
          let file = new Blob([response.data], { type: "video/mp4" });
          zip.file(v.name, file);
        })
        .catch(e => {
          status &&
            status(`item no.${i + 1} - download error: ${JSON.stringify(e)}`);
          console.log("axios error: ", e);
          //throw new Error("download failed. check console.");
        })
    );
  });

  await Promise.all(promises);
  status && status("all downloads complete. generating zip file.");

  zip.generateAsync({ type: "blob" }).then(function(content) {
    status && status("zip complete. saving!");
    // see FileSaver.js
    FileSaver.saveAs(content, "videos.zip");
  });
};

export const download = (
  content,
  fileName = "text.mp4",
  contentType = "video/webm"
) => {
  let a = document.createElement("a");
  let file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};

const downloadOneVideo = video => {
  axios({ method: "get", url: video.src, responseType: "blob" }).then(
    response => {
      download(response.data);
    }
  );
};

const VideoList = ({ date = "2019-05-08" }) => {
  // toggle preview
  const [showPreview, setShowPreview] = useState(false);
  // status reporting
  const [statuses, setStatus] = useState([]);
  const handleStatus = statusText => {
    setStatus(p => [...p.slice(-5), statusText]);
  };

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
          <button onClick={() => setShowPreview(!showPreview)}>
            preview video
          </button>

          <div>
            <button
              style={{
                color: numSelected === 0 ? "lightgray" : "black",
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

      {showPreview && (
        <h4 style={{ color: "red" }}>
          WARNING: video previews count towards download quota of 1GB/day
        </h4>
      )}
      <ul
        style={{
          height: 130,
          overflowY: "auto",
          borderRadius: 8,
          backgroundColor: "black",
          padding: 10,
          color: "white",
          margin: "0 30px",
          textAlign: "left"
        }}
      >
        {statuses.map((v, i) => (
          <li
            key={`${date}-${i}`}
            style={{
              fontSize: 11,
              padding: "2px 0",
              borderBottom: "1px solid rgba(143, 143, 143, 0.2)"
            }}
          >
            {v}
          </li>
        ))}
      </ul>

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
                      type="checkbox"
                      className={styles.checkboxSimple}
                      checked={vlistChecked[i]}
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
                      type="checkbox"
                      className={styles.checkbox}
                      checked={vlistChecked[i]}
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
