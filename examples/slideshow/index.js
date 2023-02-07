class SlideShow extends Template {
  constructor(mount) {
    console.log(mount);
    super("SlideShow", mount);
    this.preview = this.fragment.querySelector(".preview");
    this.state = {
      background: 0,
      animation: 0,
      timer: 0,
    };
    this.wide = [];
    this.tall = [];
    this.images = [
      "./images/1.jpg",
      "./images/2.jpg",
      "./images/3.jpg",
      "./images/4.jpg",
      "./images/5.jpg",
      "./images/6.jpg",
      "./images/7.jpg",
      "./images/8.jpg",
      "./images/9.jpg",
      "./images/10.jpg",
    ];
    this.render();
  }
  destroy() {
    clearTimeout(this.state.timer);
  }
  render() {
    const preview = this.preview;
    const background = document.createElement("div");
    background.classList = "background";
    const url = this.images[++this.state.background % this.images.length];
    const animation = `slide-show-image-${++this.state.animation % 6}`;
    background.style["background-image"] = `url(${url})`;
    background.style["animation-name"] = animation;
    setTimeout(() => {
      preview.removeChild(background);
    }, 6000);
    preview.prepend(background);
    setTimeout(() => this.render(), 4800);
  }
}
