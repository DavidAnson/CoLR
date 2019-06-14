"use strict";

const jpegMimeType = "image/jpeg";
const jpegQuality = 0.8;

class App extends preact.Component {
  constructor() {
    super();
    this.canvasElement = null;
    this.canvasThumbElement = null;
    this.videoElement = null;
    this.state = {
      pictures: []
    }
  }

  buttonClick() {
    const videoWidth = this.videoElement.videoWidth;
    const videoHeight = this.videoElement.videoHeight;
    [
      [ this.canvasElement, 1 ],
      [ this.canvasThumbElement, 10 ]
    ].forEach((canvas) => {
      const [ element, scale ] = canvas;
      element.width = videoWidth / scale;
      element.height = videoHeight / scale;
      element.getContext("2d").drawImage( this.videoElement, 0, 0, element.width, element.height);
    });
    const pictures = this.state.pictures;
    pictures.push({
      image: this.canvasElement.toDataURL(jpegMimeType, jpegQuality),
      thumb: this.canvasThumbElement.toDataURL(jpegMimeType, jpegQuality),
    });
    this.setState({ pictures });
  };

  render(props, state) {
    const pictureElements = state.pictures.map((picture) => {
      return preact.h(
        "li",
        null,
        preact.h("img", { src: picture.thumb }),
        preact.h("img", { src: picture.image }));
    });
    return preact.h(
      "div",
      null,
      preact.h("canvas", { ref: (e) => this.canvasElement = e }),
      preact.h("canvas", { ref: (e) => this.canvasThumbElement = e }),
      preact.h("video", { autoplay: true, playsinline: true, ref: (e) => this.videoElement = e }),
      preact.h("button", { onClick: () => this.buttonClick() }, "Snap"),
      preact.h("ul", null, ...pictureElements));
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
