class Template {
  constructor(id, mount) {
    if (id) {
      this.fragment = document.getElementById(id).content.cloneNode(true);
    }
    this.mount = mount;
    this.eventHandlers = {};
    this.children = {};
    this.state = {};
  }
  setState(obj) {
    let changed = false;
    for (let key in obj) {
      if (this.state[key] !== obj[key]) {
        changed = true;
        this.state[key] = obj[key];
      }
    }
    if (changed) {
      this.emit("change", this.state);
    }
  }
  addChild(name, child) {
    if (this.children[name]) {
      this.children[name].destroy();
    }
    this.children[name] = child;
    this.children[name].init();
  }
  getChild(name) {
    return this.children[name];
  }
  init(parentNode) {
    if (this.mount) {
      this.mount.innerText = "";
      this.mount.appendChild(this.fragment);
    }
  }
  destroy() {
    this.mount.innerText = "";
    for (const child in this.children) {
      this.children[child].destroy();
    }
  }
  on(event, handler) {
    this.eventHandlers[event] = this.eventHandlers[event] || [];
    this.eventHandlers[event].push(handler);
  }
  emit(event, ...args) {
    if (!this.eventHandlers[event]) {
      return;
    }
    this.eventHandlers[event].forEach((handler) => {
      handler(...args);
    });
  }
}
