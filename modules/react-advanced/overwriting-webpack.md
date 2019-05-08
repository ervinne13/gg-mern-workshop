# Overwriting Webpack

There are several reasons why you might want to overwrite webpack configurations. A very common reason is to add aliases to clean up our imports.

## Overwriting Without Ejecting

A nice repository (though only lightly maintained now) is the "react-app-rewired" library which allows us to update webpack configuration without having to eject from CRA.

Install it by:

```bash
npm install react-app-rewired --save-dev
```

Then let rewired do our builds by updating our scripts in our `package.json`:

From:
```json
 "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
}
```

To:
```json
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test --env=jsdom",
    "eject": "react-scripts eject"
}
```

Basically replacing `react-scripts` with `react-app-rewired`. Note that you should not change eject.

Create your overwrites to the config in the file `config-overrides.js` at the root of your project (inside `application/client` in our case).

## Adding Alias

Create the file `config-overrides.js` and put the contents:

```js
const path = require('path');

module.exports = function override(config) {
    config.resolve = {
        ...config.resolve,
        alias: { 
            'Components': path.resolve(__dirname, 'src/components'),
            'Layouts': path.resolve(__dirname, 'src/layouts'),
            'Scenes': path.resolve(__dirname, 'src/scenes') 
        },
    };

    return config;
};
```

Put your alias inside the the `alias` key. The key in this object refers to the string that your imports will use and the value points to the actual folder it should map to.

In this example, there is `src/components` folder that maps to `Component` import and `src/scenes` that maps to `Scene`. If let's say for example, there's a component called `Input` inside `src/components` folder, you may now import it using:

```jsx
import Input from 'Components/Input';
```

## Adding VSCode Support

There's still a problem with this implementation though. Doing a `Ctrl`+`click` to the path does not lead to any file in VSCode. We can resolve this by adding a `jsconfig.json` and adding our configuration there.

For example:

```js
{
    "compilerOptions": {
        "baseUrl": "src",
        "paths": {
            "Components":["src/components"],
            "Layouts":["src/layouts"],
            "Scenes":["src/scenes"],
        }
    }
}
```