import React, { useEffect } from "react";

const useInterval = (callback, delay) => {
  useEffect(() => {
    const t = setInterval(() => {
      callback();
    }, delay);

    return () => clearInterval(t);
  }, [callback, delay]);

  // no returns, because it calls the callback at intervals
};

export default useInterval;
