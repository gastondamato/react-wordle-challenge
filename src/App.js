import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import CreateTemplate from "./components/CreateTemplate";
import Nav from "./components/Nav";
import Loading from "./components/Loading";
import Checking from "./components/Checking";
import Winner from "./components/Winner";
import Looser from "./components/Looser";
import TryAgain from "./components/TryAgain";
import "./styles.css";

export default function App() {
  const MAX_LENGHT = 5;
  const MAX_LINE_COUNTER = 6;
  const SECONDS = 1000;
  const INITIAL_TIME = 5 * SECONDS;

  const [actualLetters, setActualLetters] = useState([]); //containes all the accepted and not yet accepted letters
  const [wordOfTheDay, setWordOfTheDay] = useState(""); //guess what it contains
  const [wordArray, setWordArray] = useState(""); //the word letter by letter
  const [wordMap, setWordMap] = useState({}); //a set of the wordArray and how many times the letter is repeated...
  const [validateWord, setValidateWord] = useState(""); //true or false if the word is valid
  const [tryAgain, setTryAgain] = useState(false); //if is not a valid word, try again renders
  const [definition, setDefinition] = useState(""); //fetch the definition of the word of the day
  const [msg, setMsg] = useState("Try a 5 letter word...");
  const [points, setPoints] = useState(0);
  const [speed, setSpeed] = useState(1000); //one second in ms
  const lineCounter = useRef(1); //counts in which line
  const won = useRef(false); //true if you win
  const loose = useRef(false); //true if you loose
  const historycorrect = useRef(""); //all the guess letters marked as correct - for the keyboard
  const historywrong = useRef(""); //all the guess letters marked as wrong
  const historyclose = useRef(""); //all the guess letters marked as close

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
      .catch((error) => {
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
      .catch((error) => {
        console.log("Request failed", error.name);
      });
  }, [validateWord]);

  function getDefinition(word) {
    const url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data[0].meanings[0].definitions[0].definition);
        setDefinition(data[0].meanings[0].definitions[0].definition);
      })
      .catch((error) => {
        console.log("Definition failed", error.name);
      });
  }

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
    let close = 0;
    let wrong = 0;

    const formula = (youWin, close, wrong) => {
      youWin *= Math.floor(100 / lineCounter.current);
      close *= Math.floor(50 / lineCounter.current);
      //wrong *= 5 * lineCounter.current;
      return Math.floor((youWin + close) / lineCounter.current);
    };

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
        historycorrect.current += tempArr[i + offset].letter + " ";
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
        historyclose.current += tempArr[i + offset].letter + " ";
        close++;
      } else {
        tempArr[i + offset].status = "wrong";
        historywrong.current += tempArr[i + offset].letter + " ";
        console.log(historywrong.current);
        wrong++;
      }
    }

    setPoints((oldpoints) => oldpoints + formula(youWin, close, wrong));

    console.log(points + formula(youWin, close, wrong));

    //msgs
    if (wrong === 5) {
      setMsg("Good guess! hahaha");
    } else if (close === 1 || youWin === 1) {
      setMsg("you can do better...");
    } else if (close === 2 || youWin === 2) {
      setMsg("well, well, well...");
    } else if (youWin === 3) {
      setMsg("easy rider!");
    } else if (youWin === 4) {
      setMsg("mmm close...");
    } else if (youWin === 5) {
      setMsg("clap clap clap");
    }

    setActualLetters(tempArr);
    if (youWin === MAX_LENGHT) {
      won.current = true;
      getDefinition(wordOfTheDay);
      //alert(`YOU WIN!\nIt tooke you ${lineCounter} tries...`);
    }
    if (lineCounter.current === MAX_LINE_COUNTER + 1 && youWin < MAX_LENGHT) {
      //alert("LOOOOOOSSERRR! \nThe Word Was:\n" + wordOfTheDay);
      getDefinition(wordOfTheDay);
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
      //the word is valid... increese speed of the counter!
      setSpeed((oldSpeed) => Math.floor(oldSpeed / 1.5));
      wordValidationInProgress.current = false;
      enterWorld();
    } else {
      lineCounter.current--;
      //alert("This is not a valid word... \nTry another one");
      setTryAgain(true);
    }
  }

  function checkEventKey(event) {
    if (tryAgain) return; //event key will not be allow if the tryAgain modal is on
    const action = event.key;
    switch (action) {
      case "Backspace":
        deleteLetter();
        break;
      case "Enter":
        console.log("enter into checkEventKey");
        if (!wordValidationInProgress.current) checkValidWord();
        break;
      default:
        if (isLetter(event.key)) {
          addLetter(action);
        }
    }
  }

  const onKeyPress = (button) => {
    switch (button) {
      case "{bksp}":
        deleteLetter();
        break;
      case "{enter}":
        if (!wordValidationInProgress.current) checkValidWord();
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
    wordValidationInProgress.current = false;
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
      {won.current && <Confetti zIndex={2000} className="confetti" />}
      <Nav points={points} speed={speed} />
      {wordValidationInProgress.current && <Checking />}
      {tryAgain && (
        <TryAgain word={getValidateWord()} fncontinue={continueGuessing} />
      )}

      {won.current && (
        <Winner
          word={wordOfTheDay}
          times={lineCounter.current}
          def={definition}
          points={points}
        />
      )}
      {loose.current && (
        <Looser word={wordOfTheDay} def={definition} points={points} />
      )}
      {!wordOfTheDay && <Loading />}
      <h2 className="msg text-gradient">{msg}</h2>
      <CreateTemplate value={actualLetters} line={lineCounter.current} />
      <Keyboard
        onKeyPress={onKeyPress}
        display={{
          "{bksp}": "⌫",
          "{enter}": "↩"
        }}
        layout={{
          default: [
            "Q W E R T Y U I O P {bksp}",
            "A S D F G H J K L {enter}",
            "Z X C V B N M {____________}"
          ]
        }}
        buttonTheme={[
          {
            class: "close",
            buttons: `${historyclose.current}`
          },

          {
            class: "wrong",
            buttons: `${historywrong.current}`
          },
          {
            class: "correct",
            buttons: `${historycorrect.current}`
          }
        ]}
      />
    </div>
  );
}
