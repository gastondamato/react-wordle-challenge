export default function Looser({ word, def }) {
  function refreshPage() {
    window.location.reload(false);
  }
  return (
    <section className="looser">
      <h2 className="red">You Loose...</h2>
      <p>The word was:</p>
      <h2 className="largebox correct">{word}</h2>
      <p className="definition">{def}</p>
      <button onClick={refreshPage}>TRY AGAIN</button>
    </section>
  );
}
