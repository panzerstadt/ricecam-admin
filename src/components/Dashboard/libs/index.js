import JSZip from "jszip";
import FileSaver from "file-saver";
import axios from "axios";

export { default as useInterval } from "./useInterval";

export const downloadMultiple = async (files, status) => {
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

export const downloadOneVideo = video => {
  axios({ method: "get", url: video.src, responseType: "blob" }).then(
    response => {
      download(response.data);
    }
  );
};

export const getVideoImage = (path, secs, callback) => {
  var me = this,
    video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.onloadedmetadata = function() {
    if ("function" === typeof secs) {
      secs = secs(this.duration);
    }
    this.currentTime = Math.min(
      Math.max(0, (secs < 0 ? this.duration : 0) + secs),
      this.duration
    );
  };
  video.onseeked = function(e) {
    var canvas = document.createElement("canvas");
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // var img = new Image();
    // img.crossOrigin = "anonymous";
    // img.src = canvas.toDataURL();
    const src = canvas.toDataURL();

    callback.call(me, src, this.currentTime, e);
  };
  video.onerror = function(e) {
    callback.call(me, undefined, undefined, e);
  };
  video.src = path;
};
