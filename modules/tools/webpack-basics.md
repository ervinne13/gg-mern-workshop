# Webpack Basics Activity

## Create a new Project

Create a usual NPM project by creating a new folder with the name `webpack-basics`. Change directory to inside the your new project folder and run initialize NPM.

```bash
mkdir webpack-basics
cd webpack-basics

npm init
```

And provide the name for your project.

## Add Webpack

```bash
npm i webpack -D
```

Then add scripts in your `package.json` file by adding a new `script` key with `build` and `start` scripts like so:

```json
"scripts": {
  "build": "webpack",
  "start": "webpack --watch"
},
```

## Source files

Create a file called `index.html` in your project root with the contents:

Inside `index.html`:

```html
<html>
    <head>
        <title>Testing Webpack</title>
    </head>
    <body>
        <div id="root">This will be shown before our script is loaded.</div>
        <script type="text/javascript" src="dist/bundle.js"></script>
    </body>
</html>
```

Also create a folder called `src` and inside it, an empty file `app.js`.

Notice that we don’t include the src/app.js that we just created, but dist/bundle.js. This file actually doesn’t exist yet. It’s what Webpack’s going to create for us.

Try opening this file a browser and it should output "This will be shown before our script is loaded.".

## Configuring Webpack

Create a new file called `webpack.config.js` in the root directory of your project with the contents:

```js
const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
};
```

### Configuration

- Entry: the entry file will be what webpack will be reading when creating an output. Point this to the currently empty `app.js` file we created earlier.
- Output: is where webpack will place the processed files. The output will be called `bundle.js` inside a folder called `dist` (distribution) in the current directory.

You can change the names to whatever you prefer, as long as they are in sync between webpack.config.js, files, folders and the linked script in the HTML.

## Building JavaScript with Dependencies

First, let's create multiple files that we will make `app.js` load for us. Create a new folder called `js` inside the `src` folder, then create the files `foo.js` and `bar.js` inside and write the following:

File: `src/js/foo.js`

```js
const getMarkup = () => "<h2>Hello from Foo!</h2>";

const Foo = { getMarkup };

module.exports = Foo;
```

File: `src/js/bar.js`

```js
const getMarkup = () => "<h2>Hello from Bar!</h2>";

const Bar = { getMarkup };

module.exports = Bar;
```

Finally, update `app.js` to make use of the two new files:

File: `app.js`

```js
const Bar = require('./js/bar');
const Foo = require('./js/foo');

const App = {
    render: () => {
        const markup = "Test" + Foo.getMarkup() + Bar.getMarkup();
        document.getElementById('root').innerHTML = markup;        
    }
};

App.render();
```

## Building the App

Build the application by running:

```bash
npm run build
```

You should notice that webpack will create a `dist` folder in your root directory with the file you specified in the webpack configuration earlier: `bundle.js`.

Inspec the file and you should notice a minified version of our application that also includes (if there are any) node modules.

## Adding & Compiling Styles

Create a new folder called `scss` inside the `src` folder.
Create a new file `src/scss/base.scss` with the contents:

File: `src/scss/base.scss`

```scss
$bg-color: grey;
body {
    background: $bg-color;
}
```

Import the scss file in your main file: `app.js`.

```js
import './scss/base.scss';
```

## Adding Plugins to Webpack

Run the following in Terminal to install `style-loader`, `css-loader`, `sass-loader`, `node-sass`, `extract-text-webpack-plugin`.

```bash
npm install style-loader css-loader sass-loader node-sass extract-text-webpack-plugin -D
```

Also add extract text plugin with the command below:

```bash
npm install extract-text-webpack-plugin@next -D
```

... which should allow us to extract text to a separate file. (ie. from .scss -> .css)

Add this to the top of your `webpack.config.js` file to import the plugin:

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin');
```

Then configure webpack to look for `.scss` files and run the plugin we just imported to such files by adding the `module` key with the following contents:

```js
...
module: {
    rules: [
        {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader']
            })
        }
    ]
}
```

We also need to refer to the Extract Text Plugin right before the last curly bracket. This will tell Webpack that we would like it to pack all the CSS into a separate file and call it `style.css`.

```js
plugins: [
    new ExtractTextPlugin('style.css')
]
```

To review, your `webpack.config.js` file should look something like:

```js
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css')
    ]
};
```

Then import our intended output file `style.css` in our html page by adding:

```html
<link rel='stylesheet' href='dist/style.css'>
```

... inside the `<head>` tag

Then finally, run webpack build again in the terminal:

```bash
npm run build
```

... to create our configured output files.

Check your site to see that the styling should now apply and it's now loading a `style.css` in the `dist` folder.

You can also take things a step further by implementing imports in your sass files and separating your variables and actual styling.

Create a new file `theme.scss` in the `scss` folder with the content:

```scss
$bg-color: grey;
```

... and import this file in the `base.scss` like so:

```scss
@import 'theme.scss';

body {
    background: $bg-color;
}
```

This way, you may control the colors and any other variable in your styling without having to modify each of your scss files.

Compile your project again and it should run without problems
