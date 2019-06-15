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
      pictures: [],
      picture: null
    }
  }

  snapClick() {
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

  thumbClick(picture) {
    this.setState({ picture });
  }

  backClick() {
    this.setState({ picture: null });
  }

  render(props, state) {
    const thumbs = state.pictures.map((picture) => {
      return preact.h(
        "li",
        null,
        preact.h("img", { src: picture.thumb, onClick: () => this.thumbClick(picture.image) }));
    });
    return preact.h(
      "div",
      { class: "container" },
      preact.h(
        "div",
        { class: "main" },
        preact.h("video", { class: state.picture ? "hidden" : "", autoplay: true, playsinline: true, ref: (e) => this.videoElement = e }),
        preact.h("img", { class: state.picture ? "" : "hidden", src: state.picture })),
      preact.h("div", { class: "divider" }),
      preact.h(
        "div",
        { class: "left" },
        preact.h("button", { onClick: () => this.backClick() }, "Back")),
      preact.h(
        "div",
        { class: "middle" },
        preact.h("button", { onClick: () => this.snapClick() }, "Snap")),
      preact.h(
        "div",
        { class: "right" },
        ),
      preact.h(
        "div",
        { class: "strip" },
        preact.h("ul", null, ...thumbs)),
      preact.h("canvas", { class: "hidden", ref: (e) => this.canvasElement = e }),
      preact.h("canvas", { class: "hidden", ref: (e) => this.canvasThumbElement = e }));
  };

  componentDidMount() {
    const constraints = {
      audio: false,
      video: {
        facingMode: "environment"
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
