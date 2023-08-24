class Template {
    constructor(template) {
        if (typeof template == "string") {
            const element = document.getElementById(template);
            if (!element) {
                throw new Error(`#${template} does not exist`);
            }
            if (!(element instanceof HTMLTemplateElement)) {
                throw new Error(`#${template} is not a Template`);
            }
            this.fragment = element.content.cloneNode(true);
        }
        else if (template != undefined) {
            this.fragment = template.content.cloneNode(true);
        }
        else {
            this.fragment = null;
        }
        this.host = null;
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
    setState(obj) {
        let changed = false;
        for (let key in obj) {
            if (this.state[key] !== obj[key]) {
                const value = obj[key];
                changed = true;
                if (value == undefined) {
                    delete this.state[key];
                }
                else {
                    this.state[key] = value;
                }
            }
        }
        if (changed) {
            this.emit("change", this.state);
        }
        return this;
    }
    removeChild(name) {
        const child = this.children[name];
        if (child == undefined) {
            return this;
        }
        child.unmount();
        delete this.children[name];
        return this;
    }
    addChild(name, child) {
        this.removeChild(name);
        this.children[name] = child;
        return this;
    }
    addChildren(obj) {
        for (let name in obj) {
            const child = obj[name];
            if (child == undefined) {
                continue;
            }
            this.addChild(name, child);
        }
        return this;
    }
    getChild(name) {
        return this.children[name];
    }
    mount(host) {
        if (this.host) {
            throw new Error("Already mounted");
        }
        if (!this.fragment) {
            throw new Error("No fragment to mount");
        }
        this.host = host;
        this.host.appendChild(this.fragment);
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
        this.eventHandlers = {};
        this.children = {};
        this.state = {};
        this.destroyed = true;
        return;
    }
    on(event, handler) {
        const handlers = this.eventHandlers[event] || [];
        this.eventHandlers[event] = handlers;
        handlers.push(handler);
        return this;
    }
    emit(event, ...args) {
        const handlers = this.eventHandlers[event];
        if (handlers == undefined) {
            return this;
        }
        handlers.forEach((handler) => {
            handler(...args);
        });
        return this;
    }
    static createElement(html) {
        const template = document.createElement("template");
        template.innerHTML = html;
        return template;
    }
}
export default Template;
