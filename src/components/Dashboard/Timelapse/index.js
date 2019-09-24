import React, { useState, useEffect, useRef } from "react";

import { getVideoImage, useInterval } from "../libs";

const Preview = ({ srcs, delay = 300 }) => {
  const [count, setCount] = useState(0);
  const srcsRef = useRef(srcs);
  useEffect(() => {
    srcsRef.current = srcs;
  }, [srcs]);

  useInterval(() => {
    const l = srcsRef.current.length - 1;
    if (count >= l) {
      setCount(0);
    } else {
      setCount(count + 1);
    }
  }, delay);

  return (
    <div style={{ height: 300 }}>
      <img src={srcs[count]} height="100%"></img>
    </div>
  );
};

const Timelapse = ({ data, status, run }) => {
  const [frames, setFrames] = useState({});
  useEffect(() => {
    if (data.length > 0 && run) {
      status &&
        status(
          `creating ${data.length} frames! this usually takes a long time...`
        );
      const handleAddFrames = (img, i) => {
        setFrames(prev => {
          const updated = { ...prev };
          updated[i] = img;
          return updated;
        });
      };

      data.forEach((v, i) => {
        const src = v.src;
        getVideoImage(src, 0.5, res => handleAddFrames(res, i));
      });
    }
  }, [data, run]);

  const [srcs, setSrcs] = useState([]);
  useEffect(() => {
    setSrcs([...Object.values(frames)]);
  }, [frames]);

  const [delay, setDelay] = useState(300);

  if (!run) return null;

  return (
    <div
      style={{
        position: "relative",
        border: "1px solid black",
        borderRadius: 8,
        minHeight: 50,
        margin: "0 30px",
        padding: 10
      }}
    >
      {srcs.length > 0 ? (
        <>
          <div
            style={{
              position: "absolute",
              maxHeight: 300,
              width: 50,
              overflowX: "hidden",
              overFlowY: "auto"
            }}
          >
            {srcs.map((v, i) => (
              <img key={i} src={v} width="100%"></img>
            ))}
          </div>

          <Preview srcs={srcs} delay={Math.max(delay, 30)} />
        </>
      ) : (
        <>
          <h4 style={{ margin: "10px 0 0 0" }}>Loading timelapse...</h4>
          <p style={{ marginTop: 5, marginBottom: 10, fontSize: 11 }}>
            have you selected any videos to to create the timelapse?
          </p>
        </>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: 10,
          right: 0
        }}
      >
        <div
          style={{
            margin: "0 10px 0 0",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <h5 style={{ margin: 0 }}>
            DELAY <small style={{ color: "lightgray" }}>ms</small>
          </h5>

          <small style={{ fontSize: 8, margin: 0 }}>min delay: 30</small>
        </div>

        <input
          style={{
            height: 18,
            width: 50,
            padding: 5,
            marginRight: 10,
            borderRadius: 5,
            outline: "none",
            border: "1px solid black",
            boxShadow: "1px 2px 5px #08BDBD55"
          }}
          onChange={e => setDelay(e.target.value)}
          value={delay}
        />
      </div>
    </div>
  );
};
export default Timelapse;
