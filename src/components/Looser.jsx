export default function Looser() {
  function refreshPage() {
    window.location.reload(false);
  }
  return (
    <section className="looser">
      <h2 className="red">LOOOOOOOOSERRRRR!</h2>
      <p>6 chances wasn't enough?</p>
      <button onClick={refreshPage}>TRY AGAIN</button>
    </section>
  );
}
