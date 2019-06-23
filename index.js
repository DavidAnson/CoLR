"use strict";

const jpegMimeType = "image/jpeg";
const jpegQuality = 0.8;
const dbName = "CoLR";
const debugMode = (window.location.hash === "#debug");

class App extends preact.Component {
  constructor() {
    super();
    this.canvasElement = null;
    this.canvasThumbElement = null;
    this.videoElement = null;
    this.state = {
      pictures: [],
      image: null
    }
    this.db = new Dexie(dbName);
    this.db.version(1).stores({
        pictures: "++id,image"
    });
    this.db.pictures.orderBy(":id").toArray().then((pictures) => {
      this.setState({ pictures });
    }).catch((err) => alert("db read error: " + err));
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
    const picture = {
      image: this.canvasElement.toDataURL(jpegMimeType, jpegQuality),
      thumb: this.canvasThumbElement.toDataURL(jpegMimeType, jpegQuality),
    };
    const pictures = this.state.pictures;
    pictures.push(picture);
    this.setState({ pictures });
    this.db.pictures.put(picture).catch((err) => alert("db.put error: " + err));
  };

  thumbClick(image) {
    this.setState({ image });
  }

  backClick() {
    this.setState({ image: null });
  }

  deleteClick() {
    const image = this.state.image;
    let index = -1;
    const pictures = this.state.pictures.filter((p, i) => {
      if (p.image === image) {
        index = i;
        return false;
      }
      return true;
    });
    this.setState({
      pictures,
      image: (pictures[index] || pictures[index - 1] || {}).image
    });
    this.db.pictures.where("image").equals(image).delete().catch((err) => alert("db.delete error: " + err));
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
            const selected = (p.image === state.image);
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
    const live = !state.image;
    return preact.h(
      "div",
      { class: "container" },
      preact.h(
        "div",
        { class: "lens", onClick: () => this.shutterClick() },
        preact.h("img", { class: live ? "hidden" : "", src: state.image }),
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
      preact.h("pre", null, JSON.stringify(state.videoSettings, null, "  ")),
      (state.pictures || []).map((picture) => {
        return preact.h(
          "p",
          null,
          preact.h(
            "a",
            { href: picture.image, target: "_blank" },
            preact.h(
              "img",
              { src: picture.thumb })));
      }),
      preact.h(
        "p",
        null,
        preact.h(
          "button",
          { onclick: () => Dexie.delete(dbName).catch((err) => alert("Dexie.delete error: " + err)) },
          "Delete database")));
  }
}

preact.render(preact.h(App), document.body);
