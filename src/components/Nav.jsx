import Timer from "./Timer";

export default function Nav({ points, speed }) {
  return (
    <nav>
      <ul>
        <h1 className="text-gradient text-gradient-blur">WSO</h1>
        <li>
          <Timer speed={speed} />
        </li>
        <li>{points} Points</li>
      </ul>
    </nav>
  );
}
