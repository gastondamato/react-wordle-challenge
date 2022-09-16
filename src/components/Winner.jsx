export default function Winner({ times }) {
  return (
    <section className="winner">
      <h2 className="green">YOU WIN!</h2>
      <p>It took you {times} times</p>
      <p>Refresh to try another word</p>
    </section>
  );
}
