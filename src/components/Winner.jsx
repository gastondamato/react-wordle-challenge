import React, { useEffect } from "react";

export default function Winner({ word, times, def, points }) {
  function refreshPage(event) {
    if (event.key === "Enter" || event.type === "click") {
      window.location.reload(false);
    }
  }
  useEffect(() => {
    document.addEventListener("keydown", refreshPage);
    return () => {
      document.removeEventListener("keydown", refreshPage);
    };
  }, []);
  return (
    <section className="winner">
      <h2 className="green">YOU WIN IN {times - 1} TRIES!</h2>
      <h2>
        Total Points: <b>{points}</b>
      </h2>
      <h2 className="largebox correct">{word}</h2>
      <p className="definition">"{def}"</p>
      <button onClick={refreshPage}>TRY AGAIN</button>
    </section>
  );
}
