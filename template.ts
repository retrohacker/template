type EventHandlers = { [name: string]: Function[] };
type State = { [name: string]: string | number | boolean };
type Children = { [query: string]: Template };

class Template {
  fragment: HTMLTemplateElement;
  style: HTMLStyleElement;
  eventHandlers: EventHandlers;
  elements: { [query: string]: HTMLElement };
  children: Children;
  state: { [name: string]: string | number | boolean };
  host: HTMLElement | null;
  destroyed: Boolean;
  constructor(element: HTMLTemplateElement, style: HTMLStyleElement) {
    this.fragment = element;
    this.style = style;
    this.host = null;
    this.eventHandlers = {};
    this.elements = {};
    this.children = {};
    this.state = {};
    this.destroyed = false;
  }
  _issafe() {
    if (this.destroyed) {
      throw new Error("Template has already been destroyed");
    }
  }
  getElement(selector: string): HTMLElement {
    const element = this.elements[selector];
    if (element != undefined) {
      return element;
    }
    if (this.host == undefined || this.host.shadowRoot == undefined) {
      throw new Error("Template has not been mounted");
    }
    const result = this.host.shadowRoot.querySelector(selector);
    if (result == undefined) {
      throw new Error(`Element ${selector} not found`);
    }
    if (!(result instanceof HTMLElement)) {
      throw new Error(`${selector} did not return an HTMLElement`);
    }
    this.elements[selector] = result;
    return result;
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
  addChild(selector: string, child: Template): Template {
    if (this.children[selector] != undefined) {
      throw new Error("Child already mounted");
    }
    const element = this.getElement(selector);
    child.mount(element);
    this.children[selector] = child;
    return this;
  }
  addChildren(obj: Children): Template {
    for (let query in obj) {
      const child = obj[query];
      if (child == undefined) {
        continue;
      }
      this.addChild(query, child);
    }
    return this;
  }
  getChild(query: string): Template {
    const child = this.children[query];
    if (child == undefined) {
      throw new Error(`Unknown child ${query}`);
    }
    return child;
  }
  mount(host: HTMLElement): Template {
    if (this.host) {
      throw new Error("Already mounted");
    }
    this.host = host;
    this.host.innerText = "";
    if (!this.host.shadowRoot) {
      this.host.attachShadow({ mode: "open" });
    }
    if (!this.host.shadowRoot) {
      throw new Error("Failed to create shadow root");
    }
    this.host.shadowRoot.appendChild(this.style);
    this.host.shadowRoot.appendChild(this.fragment.content.cloneNode(true));
    return this;
  }
  unmount() {
    for (const query in this.children) {
      const child = this.children[query];
      if (child == undefined) {
        continue;
      }
      child.unmount();
    }
    if (this.host) {
      this.host.innerText = "";
      if (this.host.shadowRoot) {
        this.host.shadowRoot.innerHTML = "";
      }
    }
    this.host = null;
    this.eventHandlers = {};
    this.elements = {};
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
