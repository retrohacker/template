type EventHandlers = { [name: string]: Function[] };
type State = { [name: string]: string | number | boolean };
type Children = { [name: string]: Template };

class Template {
  fragment: HTMLTemplateElement;
  style: HTMLStyleElement;
  eventHandlers: EventHandlers;
  children: Children;
  state: { [name: string]: string | number | boolean };
  host: HTMLElement | null;
  shadow: ShadowRoot | null;
  destroyed: Boolean;
  constructor(element: HTMLTemplateElement, style: HTMLStyleElement) {
    this.fragment = element;
    this.style = style;
    this.host = null;
    this.shadow = null;
    this.eventHandlers = {};
    this.children = {};
    this.state = {};
    this.destroyed = false;
  }
  _issafe() {
    if (this.destroyed) {
      throw new Error("Template has already been destroyed");
    }
  }
  setState(obj: State) {
    let changed = false;
    for (let key in obj) {
      if (this.state[key] !== obj[key]) {
        const value = obj[key];
        changed = true;
        if (value == undefined) {
          delete this.state[key];
        } else {
          this.state[key] = value;
        }
      }
    }
    if (changed) {
      this.emit("change", this.state);
    }
    return this;
  }
  removeChild(name: string) {
    const child = this.children[name];
    if (child == undefined) {
      return this;
    }
    child.unmount();
    delete this.children[name];
    return this;
  }
  addChild(name: string, child: Template): Template {
    this.removeChild(name);
    this.children[name] = child;
    return this;
  }
  addChildren(obj: Children): Template {
    for (let name in obj) {
      const child = obj[name];
      if (child == undefined) {
        continue;
      }
      this.addChild(name, child);
    }
    return this;
  }
  getChild(name: string): Template | undefined {
    return this.children[name];
  }
  mount(host: HTMLElement): Template {
    if (this.host) {
      throw new Error("Already mounted");
    }
    this.host = host;
    this.host.innerText = "";
    this.shadow = this.host.attachShadow({ mode: "closed" });
    this.shadow.appendChild(this.style);
    this.shadow.appendChild(this.fragment.content.cloneNode(true));
    this.host.appendChild(this.shadow);
    return this;
  }
  unmount() {
    for (const name in this.children) {
      const child = this.children[name];
      if (child == undefined) {
        continue;
      }
      child.unmount();
    }
    if (this.host) {
      this.host.innerText = "";
    }
    this.host = null;
    this.shadow = null;
    this.eventHandlers = {};
    this.children = {};
    this.state = {};
    this.destroyed = true;
    return;
  }
  on(event: string, handler: Function): Template {
    const handlers = this.eventHandlers[event] || [];
    this.eventHandlers[event] = handlers;
    handlers.push(handler);
    return this;
  }
  emit(event: string, ...args: any[]): Template {
    const handlers = this.eventHandlers[event];
    if (handlers == undefined) {
      return this;
    }
    handlers.forEach((handler) => {
      handler(...args);
    });
    return this;
  }
  static createElement(html: string): HTMLTemplateElement {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template;
  }
  static createStyle(css: string): HTMLStyleElement {
    const style = document.createElement("style");
    style.textContent = css;
    return style;
  }
}

export default Template;
