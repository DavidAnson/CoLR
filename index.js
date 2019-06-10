"use strict";

const video = document.querySelector("video");
const canvas = window.canvas = document.querySelector("canvas");
const button = document.querySelector("button");

button.onclick = function() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    const link = document.createElement("a");
    link.text = Date.now();
    link.href = URL.createObjectURL(blob);
    link.target = "_blank";
    document.body.appendChild(link);
  }, "image/jpeg", 0.6);
};

const constraints = {
  audio: false,
  video: {
    facingMode: "user"
  }
};

function handleSuccess(stream) {
  video.srcObject = stream;
}

function handleError(error) {
  alert("getUserMedia error: " + error);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
