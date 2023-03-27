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
      "https://placehold.co/800x600",
      "https://picsum.photos/800/600",
      "https://loremflickr.com/800/600",
      "https://placekitten.com/800/600",
      "https://loremflickr.com/800/600",
      "https://picsum.photos/1024/800",
      "https://placehold.co/1024x800",
      "https://placekitten.com/1024/800",
      "https://loremflickr.com/1200/1024",
      "https://picsum.photos/1200/1024",
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
