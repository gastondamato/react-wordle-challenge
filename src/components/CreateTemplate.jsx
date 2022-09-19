import { nanoid } from "nanoid";

function createDivs(value, line) {
  let index = value.length;
  const limiter = (line - 1) * 5;
  let divs = [];
  let counter = 0;
  for (let i = 0; i < 5 * 6; i++) {
    counter++;
    let divName = value[i] ? `box box-${i} ${value[i].status}` : `box box-${i}`;
    divName += index === counter && index > limiter ? " doScale" : "";
    divs.push(
      <div key={nanoid()} className={divName}>
        {value[i] ? value[i].letter : ""}
      </div>
    );
  }
  return divs;
}

export default function CreateTemplate({ value, line }) {
  return <div className="box-container">{createDivs(value, line)}</div>;
}
