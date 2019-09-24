import React from "react";

const Status = ({ statuses, date }) => {
  return (
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
  );
};

export default Status;
