import React, { useEffect } from "react";

export default function TryAgain({ word, fncontinue }) {
  function handleKeyDown(event) {
    if (event.key === "Enter" || event.type === "click") {
      event.stopPropagation();
      return fncontinue();
    }
  }
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <section className="tryagain">
      <h2 className="red">{word} is not a word...</h2>
      <p>FOCUS TRINITY!</p>
      <button onClick={() => fncontinue()}>CONTINUE</button>
    </section>
  );
}
