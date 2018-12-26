let micVolume = 0;
let analyser;

const handleAudioProcess = () => {
  const array = new Uint8Array(analyser.frequencyBinCount);

  analyser.getByteFrequencyData(array);

  let values = 0;

  array.map(value => {
    values += value;
    return value;
  });

  micVolume = values / array.length;
};

const setUpMicrophone = () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(stream => {
      const audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);
      javascriptNode.onaudioprocess = handleAudioProcess;
    })
    .catch(err => {
      console.error("Error: ", err);
    });
};

const getMicVolume = () => micVolume;
export { setUpMicrophone, getMicVolume };
