# Template

Template is a simple JS framework for creating interactive applications.

It focuses on using web-native patterns.

Calling it a framework is a bit of an exaggeration, it's a single `class` that manages HTML `<template>`s.

The entire "framework" is here: [./template.js](./template.js)

# Usage

Your Hello World example:

```html
<!DOCTYPE >
<html>
  <head>
    <script src="./template.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <template id="HelloWorld">
      <div class="hello-world">
        <h1 class="message"></h1>
      </div>
    </template>
    <script>
      class HelloWorld extends Template {
        constructor() {
          // First argument is the id of the template
          super("HelloWorld");
          // fragment contains the hydrated template
          // We can use it to query for child nodes, in this case: class="message"
          // Anything you want to update during runtime should be stored on "this"
          this.message = this.fragment.querySelector(".message");
        }
        setMessage(msg) {
          // Update the content of <h1 class="message">
          this.message.innerText = msg;
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

# Build process

You'll find that your `index.html` file grows pretty quick when using Template.

The fix is easy. First, create a directory called `app`.

Then create the files that make up our `index.html` "template":

For example:

`./app/pre-css.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="./template.js"></script>
    <style>
```

`./app/pre-template.html`:

```html
    </style>
  </head>
  <body>
    <div id="app"></div>
```

`./app/pre-js.html`:

```html
    <script>
```

`./app/post-js.html`:

```html
    </script>
  </body>
</html>
```

If you look at the files above, we've just split a standard `index.html` file up into chunks.

Now we use this little shell script to "build" our app by injecting our files:

```sh
cat ./app/pre-css.html > index.html
# Inject all of our CSS into the page
cat ./app/**/*.css > index.html
cat ./app/pre-template.html >> index.html
# Inject all of our HTML into the pa ge
cat ./app/**/*.html > index.html
cat ./app/pre-js.html >> index.html
# Inject all of our JS into the page
cat ./app/**/*.js >> index.html
cat ./app/post-js.html >> index.html
```

Now `index.html` contains your single page app!

You can now create folders for each component (and nested components) under the app directory.

For example, here is a file system with an `Auth` component that has two subcomponents `Login` and `Signup`:

```text
./app
├── Auth
│   ├── index.css
│   ├── index.html
│   ├── index.js
│   ├── Login
│   │   ├── index.css
│   │   ├── index.html
│   │   └── index.js
│   └── Signup
│       ├── index.css
│       ├── index.html
│       └── index.js
├── post-js.html
├── pre-css.html
├── pre-js.html
└── pre-template.html
```

For some example components, checkout the [./examples](./examples) directory.
