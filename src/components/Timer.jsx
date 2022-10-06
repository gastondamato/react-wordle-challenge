import { useState, useEffect } from "react";

export default function Timer({ speed }) {
  const [seconds, setSeconds] = useState(0);

  const timeFormat = (time) => {
    var m = Math.floor(time / 60);
    var s = time - m * 60;
    return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds + 1);
    }, speed);
    return () => clearInterval(interval);
  }, [seconds]);

  return <span>{timeFormat(seconds)}</span>;
}
