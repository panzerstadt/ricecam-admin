import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import FileSaver from "file-saver";
import axios from "axios";

import { grabListOfVideoPaths } from "../Database";

const downloadMultiple = async files => {
  var zip = new JSZip();
  // zip.file("Hello.txt", "Hello World\n");
  // var img = zip.folder("images");
  // img.file("smile.gif", imgData, { base64: true });

  console.log(files[0]);

  const promises = [];

  files.map(async v => {
    promises.push(
      axios({ method: "get", url: v.src, responseType: "blob" })
        .then(response => {
          let file = new Blob([response.data], { type: "video/mp4" });
          zip.file(v.name, file);
        })
        .catch(e => {
          console.log("axios error: ", e);
          throw new Error("download failed. check console.");
        })
    );
  });

  await Promise.all(promises);

  zip.generateAsync({ type: "blob" }).then(function(content) {
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

  // list videos from db
  const [vlist, setVlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const d = "YYYY-MM-DD";
    setLoading(true);
    setError("");
    grabListOfVideoPaths(date)
      .then(v => {
        v && setVlist(v);
        setLoading(false);
      })
      .catch(e => {
        setError(JSON.stringify(e));
        setLoading(false);
      });
  }, [date]);

  return (
    <>
      <h4>
        current list of videos on {date}: {vlist.length}{" "}
        <button onClick={() => downloadMultiple(vlist)}>DOWNLOAD ALL</button>
        <button onClick={() => setShowPreview(!showPreview)}>
          preview video
        </button>
      </h4>
      {showPreview && (
        <h4 style={{ color: "red" }}>
          WARNING: video previews count towards download quota of 1GB/day
        </h4>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap"
        }}
      >
        {loading && "Loading..."}
        {error}
        {vlist.map((v, i) => {
          return (
            <div key={v.src} style={{ margin: 5 }}>
              {!showPreview ? (
                <a href={v.src}>{v.name}</a>
              ) : (
                <video height={200} controls playsInline>
                  <source src={v.src} type="video/webm" />
                </video>
              )}
              <br />
              <small>{v.name}</small>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default VideoList;
