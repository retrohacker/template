# Template

Template is a simple JS framework for creating interactive applications.

It focuses on using web-native patterns.

Calling it a framework is a bit of an exaggeration, it's a single `class` that
manages HTML `<template>`s.

The entire "framework" is here: [./template.ts](./template.ts)

# Usage

Your Hello World example:

```html
<!DOCTYPE >
<html>
  <head></head>
  <body>
    <div id="app"></div>
    <script type="module">
      import Template from "./template.js";
      // Create an HTMLTemplateElement from the text representation of HTML
      const html = Template.createElement(
        '<div><h1 class="message">Hello Template</h2></div>'
      );
      // Create an HTMLStyleElement from the text representation of a style node
      const css = Template.createStyle("<style></style>");
      class HelloWorld extends Template {
        constructor() {
          super(html, css);
        }
        setMessage(msg) {
          // We can use getElement to query for child nodes, in this case: class="message"
          // Anything you want to update during runtime should be stored on "this"
          const message = this.getElement(".message");
          // Update the content of <h1 class="message">
          message.innerText = msg;
        }
      }
      // Get the div we want to mount into
      const app = document.getElementById("app");
      // Create an instance of our HelloWorld component
      const helloworld = new HelloWorld();
      // Mount our component into the dom
      helloworld.mount(app);
      // Set our message
      helloworld.setMessage("Hello Template!");
    </script>
  </body>
</html>
```

# How it works

Template uses HTML
[`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
to create reusable components.

We then "mount" a `<template>` into an element on the page by creating a
[shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM).

The shadow DOM encapsulates the reusable components making sure that the CSS and
JS from one component can not interfere with another.

Using `.addChild(selector: string, child: Template)` allows us to nest these
components. The parent keeps track of all mounted children. When we unmount the
parent, it will recursively unmount all children.

We follow React's philosophy of state flowing down. Our components manage their
own children, configuring the child's state. Children manage updating their own
DOM to reflect changes in state.

We also follow React's philosophy of state bubbling up. When a user interacts
with a child node, the child node emits an event. The parent receives the event
and decides what to do.

State management, event propogation, etc. are still early and need more thought.

# Build process

You'll want to use a bundler like `vite`

For example:

`index.html`

```html
<div class="WelcomeComponent">
  <div class="new button">
    <div class="icon"></div>
    <div class="title">Create New<br />Account</div>
  </div>
  <div class="pair button">
    <div class="icon"></div>
    <div class="title">Pair Existing<br />Account</div>
  </div>
</div>
```

`index.css`

```css
.WelcomeComponent {
  background-color: hsla(0, 0%, 100%, 1);
  border-radius: 5px;
  display: flex;
  flex-direction: row;
}
.button {
  padding: 1em;
  margin: 0.5em;
  cursor: pointer;
  background-color: inherit;
  transition: background-color linear 0.1s;
  border-radius: inherit;
}
.button:hover {
  background-color: hsla(0, 0%, 90%, 1);
  transition: background-color linear 0.1s;
}
```

`index.ts`

```typescript
import Template from "template";
import Feather from "feather-icons";
import html from "./index.html?raw";
import css from "./index.css?raw";

const template = Template.createElement(html);
const style = Template.createStyle(css);

class Welcome extends Template {
  constructor() {
    super(template, style);
  }
  mount(host: HTMLElement) {
    super.mount(host);
    this.getElement(".new > .icon").innerHTML =
      Feather.icons["user-plus"].toSvg();
    this.getElement(".new").addEventListener("click", () => {
      this.emit("new");
    });
    this.getElement(".pair > .icon").innerHTML =
      Feather.icons["smartphone"].toSvg();
    this.getElement(".pair").addEventListener("click", () => {
      this.emit("pair");
    });
    return this;
  }
}

export default Welcome;
```
