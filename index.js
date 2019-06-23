"use strict";

const jpegMimeType = "image/jpeg";
const jpegQuality = 0.8;
const debugMode = (window.location.hash === "#debug");

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

  shutterClick() {
    const videoWidth = this.videoElement.videoWidth;
    const videoHeight = this.videoElement.videoHeight;
    [
      [ this.canvasElement, 1 ],
      [ this.canvasThumbElement, 100 / videoHeight ]
    ].forEach((canvas) => {
      const [ element, scale ] = canvas;
      element.width = videoWidth * scale;
      element.height = videoHeight * scale;
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

  deleteClick() {
    const picture = this.state.picture;
    let index = -1;
    const pictures = this.state.pictures.filter((p, i) => {
      if (p.image === picture) {
        index = i;
        return false;
      }
      return true;
    });
    this.setState({
      pictures,
      picture: (pictures[index] || pictures[index - 1] || {}).image
    });
  }

  render(props, state) {
    if (debugMode) {
      return this.renderDebug(props, state);
    }
    const roll = state.pictures.length ?
      preact.h(
        "div",
        { class: "roll" },
        preact.h(
          "ul",
          null,
          state.pictures.map((p) => {
            const selected = (p.image === state.picture);
            return preact.h(
              "li",
              null,
              preact.h("img", { class: selected ? "selected" : "", src: p.thumb, onClick: () => this.thumbClick(p.image) }));
          }))) :
      preact.h(
        "div",
        { class: "roll credits" },
        preact.h(
          "a",
          { href: "https://github.com/DavidAnson", target: "_blank" },
          "Camera of Last Resort"));
    const live = !state.picture;
    return preact.h(
      "div",
      { class: "container" },
      preact.h(
        "div",
        { class: "lens", onClick: () => this.shutterClick() },
        preact.h("img", { class: live ? "hidden" : "", src: state.picture }),
        preact.h("video", { class: live ? "" : "minimized", autoplay: true, playsinline: true, ref: (e) => this.videoElement = e })),
      preact.h(
        "div",
        { class: "icon back" + (live ? " hidden" : ""), onClick: () => this.backClick() },
        "🔙"),
      preact.h(
        "div",
        { class: "icon delete" + (live ? " hidden" : ""), onClick: () => this.deleteClick() },
        "🗑"),
      preact.h(
        "div",
        { class: "divider" }),
      roll,
      preact.h("canvas", { class: "hidden", ref: (e) => this.canvasElement = e }),
      preact.h("canvas", { class: "hidden", ref: (e) => this.canvasThumbElement = e }));
  };

  componentDidMount() {
    const constraints = {
      audio: false,
      video: {
        width: { ideal: 5000 },
        height: { ideal: 5000 },
        facingMode: "environment"
      }
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        this.videoElement.srcObject = stream;
        if (debugMode) {
          const videoSettings = stream.getVideoTracks()[0].getSettings();
          this.setState({ videoSettings });
        }
      })
      .catch((err) => {
        alert("getUserMedia error: " + err);
      });
  };

  renderDebug(props, state) {
    return preact.h(
      "div",
      null,
      preact.h("pre", null, window.navigator.userAgent),
      preact.h("p", null, preact.h("video", { class: "minimized", autoplay: true, playsinline: true, ref: (e) => this.videoElement = e })),
      preact.h("pre", null, JSON.stringify(state.videoSettings, null, "  ")));
  }
}

preact.render(preact.h(App), document.body);
