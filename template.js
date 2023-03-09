class Template {
  constructor(id) {
    if (id) {
      this.fragment = document.getElementById(id).content.cloneNode(true);
    }
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
  removeChild(name) {
    if (this.children[name]) {
      this.children[name].destroy();
    }
  }
  addChild(name, child) {
    this.removeChild(name);
    this.children[name] = child;
  }
  getChild(name) {
    return this.children[name];
  }
  mount(mount) {
    if (this.mount) {
      this.mount.innerText = "";
    }
    this.mount = mount;
    this.mount.appendChild(this.fragment);
  }
  unmount() {
    if (this.mount) {
      this.mount.innerText = "";
    }
    for (const child in this.children) {
      this.children[child].unmount();
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
