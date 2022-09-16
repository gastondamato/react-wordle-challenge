function createDivs(value) {
  let divs = [];
  for (let i = 0; i < 5 * 6; i++) {
    let divName = value[i] ? `box box-${i} ${value[i].status}` : `box box-${i}`;
    divs.push(<div className={divName}>{value[i] ? value[i].letter : ""}</div>);
  }
  return divs;
}

export default function CreateTemplate({ value }) {
  return <div className="box-container">{createDivs(value)}</div>;
}
