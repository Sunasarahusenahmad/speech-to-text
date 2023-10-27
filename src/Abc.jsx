import React, { useState } from "react";

function Abc() {
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
        setTranscription(`Transcription: ${result}`);
      };

      speechRecognition.onend = () => {
        setTranscription(
          (prevTranscription) =>
            prevTranscription + " (Speech recognition ended.)"
        );
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
    <div>
      <h1>Select Audio File</h1>
      <input type="file" accept=".mp3" onChange={convertAudioToText} />
      <div id="output">
        <h2>Transcription:</h2>
        <p>{isConverting ? "Converting... Please wait." : transcription}</p>
      </div>
    </div>
  );
}

export default Abc;
