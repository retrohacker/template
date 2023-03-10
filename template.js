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
    return this;
  }
  removeChild(name) {
    if (this.children[name]) {
      this.children[name].destroy();
    }
    return this;
  }
  addChild(name, child) {
    this.removeChild(name);
    this.children[name] = child;
    return this;
  }
  addChildren(obj) {
    for (let name in obj) {
      this.addChild(name, obj[name]);
    }
    return this;
  }
  getChild(name) {
    return this.children[name];
  }
  mount(host) {
    if (this.host) {
      this.host.innerText = "";
    }
    this.host = host;
    this.host.appendChild(this.fragment);
    return this;
  }
  unmount() {
    if (this.host) {
      this.host.innerText = "";
    }
    for (const child in this.children) {
      this.children[child].unmount();
    }
    return this;
  }
  on(event, handler) {
    this.eventHandlers[event] = this.eventHandlers[event] || [];
    this.eventHandlers[event].push(handler);
    return this;
  }
  emit(event, ...args) {
    if (!this.eventHandlers[event]) {
      return this;
    }
    this.eventHandlers[event].forEach((handler) => {
      handler(...args);
    });
    return this;
  }
}
