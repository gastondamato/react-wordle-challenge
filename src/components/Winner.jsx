export default function Winner({ word, times }) {
  function refreshPage() {
    window.location.reload(false);
  }
  return (
    <section className="winner">
      <h2 className="green">YOU WIN IN {times - 1} TRIES!</h2>
      <h2 className="largebox correct">{word}</h2>
      <button onClick={refreshPage}>TRY AGAIN</button>
    </section>
  );
}
