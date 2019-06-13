"use strict";

class App extends preact.Component {
  canvasRef(element) {
    this.canvasElement = element
  };
  videoRef(element) {
    this.videoElement = element
  };

  buttonClick() {
    const videoWidth = this.videoElement.videoWidth;
    const videoHeight = this.videoElement.videoHeight;
    this.canvasElement.width = videoWidth;
    this.canvasElement.height = videoHeight;
    this.canvasElement.getContext("2d").drawImage(this.videoElement, 0, 0, videoWidth, videoHeight);

    const img = document.createElement("img");
    img.src = this.canvasElement.toDataURL('image/jpeg', 0.6);
    img.width = 100;
    document.body.appendChild(img);
  };

  render() {
    return preact.h(
      "div",
      null,
      preact.h("video", { autoplay: true, playsinline: true, ref: (e) => this.videoRef(e) }),
      preact.h("canvas", { style: "display:none", ref: (e) => this.canvasRef(e) }),
      preact.h("button", { onClick: () => this.buttonClick() }, "Snap"));
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
