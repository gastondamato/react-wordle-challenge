import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import CreateTemplate from "./components/CreateTemplate";
import Loading from "./components/Loading";
import Checking from "./components/Checking";
import Winner from "./components/Winner";
import Looser from "./components/Looser";
import TryAgain from "./components/TryAgain";
import "./styles.css";

export default function App() {
  const MAX_LENGHT = 5;
  const MAX_LINE_COUNTER = 6;
  const [actualLetters, setActualLetters] = useState([]);
  const [wordOfTheDay, setWordOfTheDay] = useState("");
  const [wordArray, setWordArray] = useState("");
  const [wordMap, setWordMap] = useState({});
  const [validateWord, setValidateWord] = useState("");
  const [tryAgain, setTryAgain] = useState(false);
  const lineCounter = useRef(1);
  const won = useRef(false);
  const loose = useRef(false);

  const wordValidationInProgress = useRef(false);

  function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }

  useEffect(() => {
    document.addEventListener("keydown", checkEventKey);
    return () => {
      document.removeEventListener("keydown", checkEventKey);
    };
  }, [actualLetters]);

  useEffect(() => {
    fetch("https://words.dev-apis.com/word-of-the-day/?random=1")
      .then((res) => res.json())
      .then((data) => {
        createWordArray(data.word.toUpperCase());
      })
      .catch(function (error) {
        console.log("Request failed", error.name);
      });
  }, []);

  useEffect(() => {
    if (validateWord === "") return;
    fetch("https://words.dev-apis.com/validate-word/", {
      method: "POST",
      body: JSON.stringify({ word: validateWord })
    })
      .then((res) => res.json())
      .then((data) => {
        isValid(data.validWord);
      })
      .catch(function (error) {
        console.log("Request failed", error.name);
      });
  }, [validateWord]);

  function createWordArray(word) {
    setWordOfTheDay(word);
    const tempArr = [];
    for (let i = 0; i < word.length; i++) {
      tempArr.push({ letter: word[i], status: "correct", duplicated: 0 });
    }
    setWordArray(tempArr);
    const arr = [];
    for (let i = 0; i < word.length; i++) {
      arr.push(word[i]);
    }
    setWordMap(createWordMap(arr));
  }

  function addLetter(letter) {
    if (actualLetters.length < MAX_LENGHT * lineCounter.current) {
      const tempArr = [...actualLetters];
      tempArr.push({ letter: letter.toUpperCase(), status: "guess" });
      setActualLetters(tempArr);
    } else {
      const tempArr = [...actualLetters];
      tempArr.pop();
      tempArr.push({ letter: letter.toUpperCase(), status: "guess" });
      setActualLetters(tempArr);
    }
  }

  function deleteLetter() {
    if (actualLetters.length > MAX_LENGHT * (lineCounter.current - 1)) {
      const tempArr = [...actualLetters];
      tempArr.pop();
      setActualLetters(tempArr);
    }
  }

  function enterWorld() {
    const tempArr = [...actualLetters];

    let offset = (0 + lineCounter.current - 1) * MAX_LENGHT - 5;

    let youWin = 0;

    //clone wordMap object into tempMap
    const tempMap = {};
    for (let key in wordMap) {
      tempMap[key] = wordMap[key];
    }
    for (let i = 0; i < MAX_LENGHT; i++) {
      if (tempArr[i + offset].letter === wordArray[i].letter) {
        youWin++;
        tempArr[i + offset].status = "correct";
        tempMap[tempArr[i + offset].letter]--;
      }
    }

    for (let i = 0; i < MAX_LENGHT; i++) {
      if (tempArr[i + offset].letter === wordArray[i].letter) {
        //we did this already...
      } else if (
        wordOfTheDay.includes(tempArr[i + offset].letter) &&
        tempMap[tempArr[i + offset].letter] > 0
      ) {
        tempArr[i + offset].status = "close";
        tempMap[tempArr[i + offset].letter]--;
      } else {
        tempArr[i + offset].status = "wrong";
      }
    }

    setActualLetters(tempArr);
    if (youWin === MAX_LENGHT) {
      won.current = true;
      //alert(`YOU WIN!\nIt too you ${lineCounter} tries...`);
    }
    if (lineCounter.current === MAX_LINE_COUNTER + 1 && youWin < MAX_LENGHT) {
      //alert("LOOOOOOSSERRR! \nThe Word Was:\n" + wordOfTheDay);
      loose.current = true;
    }
  }

  function checkValidWord() {
    if (actualLetters.length === MAX_LENGHT * lineCounter.current) {
      wordValidationInProgress.current = true;
      lineCounter.current++;
      let createdWord = "";
      let offset = (0 + lineCounter.current - 1) * MAX_LENGHT - 5;

      for (let i = 0; i < MAX_LENGHT; i++) {
        createdWord += actualLetters[i + offset].letter;
      }

      setValidateWord(createdWord);
    } else {
      return;
    }
  }

  function isValid(isValidWord) {
    setValidateWord("");

    if (isValidWord) {
      enterWorld();
    } else {
      lineCounter.current--;
      //alert("This is not a valid word... \nTry another one");
      setTryAgain(true);
    }
    wordValidationInProgress.current = false;
  }

  function checkEventKey(event) {
    const action = event.key;
    switch (action) {
      case "Backspace":
        deleteLetter();
        break;
      case "Enter":
        checkValidWord();
        //enterWorld();
        break;
      default:
        if (isLetter(event.key)) {
          addLetter(action);
        }
    }
  }

  onKeyPress = (button) => {
    switch (button) {
      case "{bksp}":
        deleteLetter();
        break;
      case "{enter}":
        checkValidWord();
        //enterWorld();
        break;
      default:
        if (isLetter(button)) {
          addLetter(button);
        }
    }
  };

  function createWordMap(arr) {
    const obj = {};
    for (let i = 0; i < arr.length; i++) {
      const letter = arr[i];
      if (obj[letter]) {
        obj[letter]++;
      } else {
        obj[letter] = 1;
      }
    }

    return obj;
  }

  function continueGuessing() {
    console.log("continue");
    setTryAgain(false);
  }

  function getValidateWord() {
    let triedWord = "";
    for (let i = actualLetters.length - 5; i < actualLetters.length; i++) {
      triedWord += actualLetters[i].letter;
    }
    return triedWord;
  }

  return (
    <div className="App">
      {wordValidationInProgress.current && <Checking />}
      {tryAgain && (
        <TryAgain word={getValidateWord()} fncontinue={continueGuessing} />
      )}
      {won.current && <Confetti />}
      {won.current && <Winner />}
      {loose.current && <Looser />}
      {!wordOfTheDay && <Loading />}
      <h1>WORDLE CLONE</h1>
      <CreateTemplate value={actualLetters} />
      <Keyboard
        onChange={this.onChange}
        onKeyPress={this.onKeyPress}
        layout={{
          default: [
            "Q W E R T Y U I O P {bksp}",
            "A S D F G H J K L {enter}",
            "Z X C V B N M   "
          ]
        }}
      />
    </div>
  );
}
