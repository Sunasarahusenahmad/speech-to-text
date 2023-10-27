import React, { useState, useEffect } from "react";
import styles from "./app.module.css";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import { BiSolidCopyAlt } from "react-icons/bi";
import { BsFillMicFill } from "react-icons/bs";
import { BsFillMicMuteFill } from "react-icons/bs";
import { SiConvertio } from "react-icons/si";
import Select from "react-select"; // Import the Select component

const App = () => {
  const [copyTxt, setCopyTxt] = useState("");
  const [isCopied, setCopied] = useClipboard(copyTxt);
  const [selectedLanguage, setSelectedLanguage] = useState({
    value: "en-In",
    label: "English (India)",
  });
  const [targetLanguage, setTargetLanguage] = useState("en-In");
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({
      continuous: true,
      language: targetLanguage,
    });
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const languageOptions = [
    { value: "en-In", label: "English (India)" },
    { value: "hi-In", label: "Hindi (India)" },
    { value: "bn-In", label: "Bengali (India)" },
    { value: "te-In", label: "Telugu (India)" },
    { value: "ta-In", label: "Tamil (India)" },
    { value: "mr-In", label: "Marathi (India)" },
    { value: "gu-In", label: "Gujarati (India)" },
    { value: "kn-In", label: "Kannada (India)" },
    { value: "ml-In", label: "Malayalam (India)" },
    { value: "ur-In", label: "Urdu (India)" },
    { value: "or-In", label: "Odia (India)" },
    { value: "pa-In", label: "Punjabi (India)" },
    { value: "as-In", label: "Assamese (India)" },
    { value: "mr-In", label: "Marathi (India)" },
    { value: "ne-In", label: "Nepali (India)" },
    // You can continue to add more Indian languages as needed
  ];

  useEffect(() => {
    if (selectedLanguage) {
      setTargetLanguage(selectedLanguage.value);
    }
  }, [selectedLanguage]);

  if (!browserSupportsSpeechRecognition) {
    return alert("no browser support");
  }

  return (
    <>
      <div className={styles.container}>
        <h1>
          Speech to Text Converter <SiConvertio className={styles.headIcon} />
        </h1>
        <p>
          Note: To copy written text, firstly click once on the white board
          after clicking the Stop button.
        </p>
        <Select
          options={languageOptions}
          value={selectedLanguage}
          onChange={(selectedOption) => setSelectedLanguage(selectedOption)}
          placeholder="Select a language"
        />
        <div
          className={styles.mainContent}
          onClick={() => setCopyTxt(transcript)}
        >
          {transcript}
        </div>
        <div className={styles.btn}>
          <button
            onClick={isListening ? stopListening : startListening}
            className={isListening ? styles.stopButton : styles.startButton}
          >
            {isListening ? (
              <>
                <BsFillMicMuteFill />
                Stop
              </>
            ) : (
              <>
                <BsFillMicFill />
                Start
              </>
            )}
          </button>
          <button onClick={setCopied}>
            <BiSolidCopyAlt />
            {isCopied ? " Copied" : " Copy to clipboard"}
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
