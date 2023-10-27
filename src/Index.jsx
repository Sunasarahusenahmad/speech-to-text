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

const SpeechToTextConverter = () => {
  ////////////////////////// Speech to Text Converter \\\\\\\\\\\\\\\\\\\\\\\\\

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
    if (selectedLanguage && !isListening) {
      setTargetLanguage(selectedLanguage.value);
    }
  }, [selectedLanguage, isListening]);

  const handleClear = () => {
    setCopyTxt(""); // Clear the clipboard content
  };

  if (!browserSupportsSpeechRecognition) {
    return alert("no browser support");
  }

  ////////////////////////// Audio to Text Converter \\\\\\\\\\\\\\\\\\\\\\\\\

  const [transcription, setTranscription] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  const convertAudioToText = async (e) => {
    setIsConverting(true);
    setTranscription("Converting... Please wait.");

    const audioFile = e.target.files[0];
    const audioContext = new AudioContext();

    try {
      const audioData = await readFileAsArrayBuffer(audioFile);
      const buffer = await audioContext.decodeAudioData(audioData);

      const audioBufferSource = audioContext.createBufferSource();
      audioBufferSource.buffer = buffer;

      const speechRecognition = new window.webkitSpeechRecognition(); // Using the Web Speech API
      speechRecognition.lang = "en-US"; // Set the language to your preference

      speechRecognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscription(`${result}`);
      };

      speechRecognition.onend = () => {
        setTranscription((prevTranscription) => prevTranscription + "");
        setIsConverting(false);
      };

      audioBufferSource.connect(audioContext.destination);
      audioBufferSource.start();
      speechRecognition.start();
    } catch (error) {
      setTranscription("Error converting audio to text.");
      setIsConverting(false);
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <h1>
            Speech to Text Converter <SiConvertio className={styles.headIcon} />
          </h1>
          <Select
            options={languageOptions}
            className={styles.selectLanguage}
            value={selectedLanguage}
            onChange={(selectedOption) => {
              if (!isListening) {
                setSelectedLanguage(selectedOption);
              }
            }}
            placeholder="Select a language"
            isDisabled={isListening}
          />
          <div className={styles.mainContent}>{transcript}</div>

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
            <button onClick={handleClear}>Clear</button>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <h1>
            Audio to Text Converter <SiConvertio className={styles.headIcon} />
          </h1>
          <div className={styles.mainContentAudio}>
            <label style={{ fontSize: "13px" }}>Choose Audio File :</label>
            <input
              className={styles.audioInput}
              type="file"
              accept=".mp3"
              onChange={convertAudioToText}
            />
            <div id="output">
              <h4 style={{ paddingTop: "10px" }}>Transcription:</h4>
              <p>
                {isConverting ? "Converting... Please wait." : transcription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpeechToTextConverter;
