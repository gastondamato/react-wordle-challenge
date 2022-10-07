import React, { useEffect } from "react";

export default function Looser({ word, def, points }) {
  function refreshPage(event) {
    console.log(event.type);
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
    <section className="looser">
      <h2 className="red">You Loose...</h2>
      <p>The word was:</p>
      <h2 className="largebox correct">{word}</h2>
      <h2>
        You made only <b>{points}</b> points
      </h2>
      <p className="definition">"{def}"</p>
      <button onClick={refreshPage}>TRY AGAIN</button>
    </section>
  );
}
