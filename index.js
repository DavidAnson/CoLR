"use strict";

class App extends preact.Component {
  canvasElement = null;
  videoElement = null;
  canvasRef = (element) => {
    this.canvasElement = element
  };
  videoRef = (element) => {
    this.videoElement = element
  };

  buttonClick = () => {
    this.canvasElement.width = this.videoElement.videoWidth;
    this.canvasElement.height = this.videoElement.videoHeight;
    this.canvasElement.getContext("2d").drawImage(
      this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height);

    const img = document.createElement("img");
    img.src = this.canvasElement.toDataURL('image/jpeg', 0.6);
    img.width = 100;
    document.body.appendChild(img);
  };

  render() {
    return preact.h(
      "div",
      null,
      preact.h("video", { autoplay: true, playsinline: true, ref: this.videoRef }),
      preact.h("canvas", { style: "display:none", ref: this.canvasRef }),
      preact.h("button", { onClick: this.buttonClick }, "Snap"));
  };

  componentDidMount() {
    const constraints = {
      audio: false,
      video: {
        facingMode: "user"
      }
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        this.videoElement.srcObject = stream;
      })
      .catch((err) => {
        alert("getUserMedia error: " + err);
      });
  };
}

preact.render(preact.h(App), document.body);
