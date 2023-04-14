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

The fix is easy.

First, create a directory called `src`. Create two folders under that, `index` and `static`. `index` will be used to generate index.html, and `static` will contain static assets that get copied into your build directory. Next create a bash script that injects your files into an HTML document.

For example:
```sh
#!/usr/bin/env bash

mkdir -p ./build

echo "
<!DOCTYPE html>
<html>
  <head>
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
    <style>
" > ./build/index.html

# Inject CSS
find ./src/index -name '*.css' | sort | xargs cat >> ./build/index.html

echo "
</style>
  </head>
  <body>
" >> ./build/index.html

# Inject HTML
find ./src/index -name '*.html' | sort | xargs cat >> ./build/index.html

echo "
<script src='/fuse.js'></script>
<script>
" >> ./build/index.html

# Inject JS
find ./src/index -name '*.js' | sort | xargs cat >> ./build/index.html


echo "
    </script>
  </body>
</html>" >> ./build/index.html;

# Copy static files over
cp -r ./src/static/* ./build
```

Now `index.html` contains your single page app!

You can now create folders for each component (and nested components) under the app directory.

For example, here is a file system with an `Auth` component that has two subcomponents `Login` and `Signup`:

```text
./index
├── Auth
│   ├── index.html
│   ├── index.js
│   ├── Login
│   │   ├── index.html
│   │   └── index.js
│   └── Signup
│       ├── index.html
│       └── index.js
└── ZZ_TAIL
    └── index.js
```

Note the use of alpha-numeric sorting to control the order files get injected into `index.html`. In this case, we are using the prefix `ZZ_` to force `ZZ_TAIL/index.js` to be the last javascript file injected. This is the file we use to bootstrap the app after all the classes are defined.

For some example components, checkout the [./examples](./examples) directory.
