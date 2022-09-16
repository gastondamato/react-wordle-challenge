export default function TryAgain({ word, fncontinue }) {
  return (
    <section className="tryagain">
      <h2 className="red">{word} is not a word...</h2>
      <p>FOCUS TRINITY!</p>
      <button onClick={() => fncontinue()}>CONTINUE</button>
    </section>
  );
}
