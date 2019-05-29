# Building the User Interface

We've learned in the previous sessions that in developing React based applications, we need to be "thinking in react". In summary, that means we think of our interface as blocks of reusable components that we can just "stitch".

Open this [link](https://xd.adobe.com/view/cdc8394c-8a65-42ad-56af-3d559771ce3e-bbf9/) to view the user interface plan.

## Identifying the Components

Follow along the instructor as he walks you through the XD file that contains the sample user interface. In summary, the components that we should be able to produce are the following:

__Splash/Login Related__
- Logo & Title
- Bordered Button

__Calendar Related__
- Calendar Link Item
- Vertical Date Navigator

__TODO Related__
- Main Header
- Primary Button
- Task
- Task Form
- Confirm Delete Modal

## Creating the Palette through Storybook

Install Storybook for React with:

```bash
npm install -D @storybook/react
```

Make sure that you have react, react-dom, @babel/core, and babel-loader in your dependencies as well because we list these as a peer dependencies:

Then add a script in your `package.json` file:

```json
{
    "scripts": {
        "storybook": "start-storybook"
    }
}
```

For a basic Storybook configuration, the only thing you need to do is tell Storybook where to find stories.

To do that, create a file at `.storybook/config.js` with the following content:

```jsx
import { configure } from '@storybook/react';

function loadStories() {
  require('./stories/buttons.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);
```

That’ll load stories in `.storybook/stories/buttons.js`. You can choose where to place stories, you can co-locate them with source files, or place them in an other directory.

Lets now write our first story, a logo for the application:

```jsx
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module)
    .add('bordered (Google Login)', () => (
        <h1>Hello, I'm just a placeholder component, replace me later :)</h1>
    ));
```

Then run our storybook with:

```bash
npm run storybook
```

As it is, it can only display the actual component, we can step this up further by making use of storybook infos. Install:

```bash
npm i -D @storybook/addon-info
```

Then update your `.storybook/config.js` to apply global configurations:

```jsx
import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

function loadStories() {
    require('./stories/index.js');
    // You can require as many stories as you need.
}

addDecorator(
    withInfo({
        inline: true, 
        header: false, 
        source: true,
    })
);

configure(loadStories, module);
```

You may also apply configuration per story. If you're interested in that, see this reference: [Storybook Addons Info](https://github.com/storybooks/storybook/tree/master/addons/info)

All in all, you should see something like:

![Storybook 1](/img/storybook-01.png)

## Our First Component: Bordered Button

Create the component `App/Client/Common/Components/BorderedButton.jsx`

```jsx
import React from 'react';
import './style.css';

const BorderedButton = ({ children, ...props }) => (
    <button className="bordered-button -color-main" { ...props }>
        {children}
    </button>
);

export default BorderedButton;
```

Create its style by creating a `style.css` file next to it with the contents

```css
.bordered-button.-color-main {
    border: 2px solid #F28123;
    border-radius: 6px;
    background: white;

    padding: 8px;
}

.bordered-button.-color-main:active {
    background: whitesmoke;
    border: 2px solid #DF6E11;
    outline: none;
}

.bordered-button.-color-main:focus {    
    outline: none;
}
```

Lastly, enable importing this component using the folder by creating a directory descriptor - `package.json` next to it:

```json
{
    "main": "./BorderedButtonComponent.jsx"
}
```

With this, you may import the `BorderedButton` this way:

```jsx
//  Good!
import BorderedButton from 'App/Client/Common/Components/BorderedButton';
```

instead of the longer and repititive:

```jsx
//  Bad!
import BorderedButton from 'App/Client/Common/Components/BorderedButton/BorderedButtonComponent';
```

## Protecting Components with Prop Types

First, install prop types with:

```bash
npm install prop-types
```

We may require the border button's content by making the "children" required:

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const BorderedButton = ({ children, ...props }) => (
    <button className="bordered-button -color-main" { ...props }>
        {children}
    </button>
);

BorderedButton.propTypes = {
    children: PropTypes.node.isRequired
};

export default BorderedButton;
```

## Updating Storybook

Let's display the buttons by updating our `buttons.js` storybook file:

```jsx
import React from 'react';
import { storiesOf } from '@storybook/react';
import BorderedButton from 'App/Client/Common/Components/BorderedButton';

storiesOf('Bordered Button', module)
    .add('with plain text', () => (
        <BorderedButton >Hi I'm Bordered Button</BorderedButton>
    ))
    .add('with on click', () => (
        <BorderedButton onClick={ () => alert('do something here') }>
            Click Me!
        </BorderedButton>
    ))
```

If you try to open this in storybook or just start the storybook, it's very likely that you'll encounter an error. If you do, that's because storybook does not know where to look for imports starting at `App/Client` etc.

We can tell storybook about it by adding a webpack config for it. Create the file `.storybook/webpack.config.js` with the contents:

```js
const path = require('path');

module.exports = {
    resolve: {
        modules: [path.resolve(__dirname, "../src"), "node_modules"],
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                loader: 'raw-loader',
                include: path.resolve(__dirname, '../')
            }
        ]
    }
   
}
```

`resolve.modules` add `../src` to the folders that will be read by Storybook's Webpack and `module.rules` will add svg support which we will be needing later on.

Restart your storybook and it should should look something like:

![Storybook 02](/img/storybook-02.png)

## Implementing Google Auth Button From Bordered Button

If you use Adobe XD, you can select icons that we've imported there and export them as SVG. We can then use them in our application.

Create a new folder `App/Client/Features/Landing/GoogleLoginButton` and paste the svg icon there. In the same folder, create the component `GoogleLoginButtonComponent.jsx` and the directory descriptor similar to what we did before.

File `GoogleLoginButtonComponent.jsx`:
```jsx
import React from 'react';
import BorderedButton from 'App/Client/Common/Components/BorderedButton';
import { ReactComponent as Logo } from './google-icon.svg';
import './style.css';

const GoogleLoginButton = () => (
    <BorderedButton size="large" className="google-auth-button" onClick={() => handleGoogleAuthentication()}>
        Sign In with Google <Logo />
    </BorderedButton>
);

const handleGoogleAuthentication = () => {
    console.log('Pending Feature :)');
};

export default GoogleLoginButton;
```

File `style.css`

```css
.google-auth-button svg {
    vertical-align: middle;
    margin-left: 10px;
    height: 16px;
    width: 16px;    
}

.google-auth-button {    
    min-width: 30%;
}
```

Present the component in the Storybook by adding:
```jsx
.add('google login', () => (
        <GoogleLoginButton size="large" />
    ), {
        info: {
            text: "Try resizing the container, this button's width is 30% of the parent"
        }
    })
```

## Adding a Primary Button

We can just create a new component called `PrimaryButton` to implement this but you should notice that it's functionality is pretty much the same as the `BorderedButton`.
We will be repeating code if we did that.

What we can do instead is refactor. Change `BorderedButton` into something more generic and parameterize the style. The property `style` is reserved though so we can use something like fill="border|background" instead.

### Refactoring `BorderedButton`

Create a new component `App/Client/Common/Components/Button/ButtonComponent` with the content:

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const Button = ({ children, fill, size, className, ...props }) => (
    <button className={`gg-button fill-${fill} -color-main -size-${size} ${className}`} {...props}>
        {children}
    </button>
);

Button.defaultProps = {
    size: 'regular',
    className: '',
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    fill: PropTypes.oneOf(['border', 'background']),
    size: PropTypes.oneOf(['regular', 'large']),
};

export default Button;
```

Its `style.css` should be:
```css

button.fill-border.-color-main {
    border: 2px solid #F28123;
    border-radius: 6px;
    background: white;

    padding: 8px;    
}

button.fill-border.-large {
    padding: 14px;
}

button.fill-border.-color-main:active {
    background: whitesmoke;
    border: 2px solid #DF6E11;
    outline: none;
}

button.fill-border:focus {    
    outline: none;
}
```

Update your Storybook file `buttons.js` to use `Button` instead of `BorderedButton`:

```jsx
import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from 'App/Client/Common/Components/Button';
import GoogleLoginButton from 'App/Client/Features/Landing/GoogleLoginButton';

storiesOf('Button', module)
    .add('bordered with plain text', () => (
        <Button fill="border">Hi I'm Bordered Button</Button>
    ))
    .add('bordered size = large', () => (
        <Button fill="border" size="large">Hi I'm Bordered Button</Button>
    ))
    .add('bordered with on click', () => (
        <Button fill="border" onClick={() => alert('do something here')}>
            Click Me!
        </Button>
    ))
    .add('google login', () => (
        <GoogleLoginButton size="large" />
    ), {
        info: {
            text: "Try resizing the container, this button's width is 30% of the parent"
        }
    })
```

Then update `GoogleLoginButton` to ditch `BorderedButton` as well.

```jsx
import React from 'react';
import Button from 'App/Client/Common/Components/Button';
import { ReactComponent as Logo } from './google-icon.svg';
import './style.css';

const GoogleLoginButton = () => (
    <Button fill="border" size="large" className="google-auth-button" onClick={() => handleGoogleAuthentication()}>
        Sign In with Google <Logo />
    </Button>
);

const handleGoogleAuthentication = () => {
    console.log('Pending Feature :)');
};

export default GoogleLoginButton;
```

And finally, delete the `App/Client/Common/Components/BorderedButton`. We should be able to achieve the same results.

### Implementing fill="background"

Let's update our `buttons.js` Storybook file and add the following:

```jsx
.add('primary button', () => (
        <Button fill="background">Primary Filled Button</Button>
    ))
```

This will then add an unstyled button in our Storybook. Let's also refactor our CSS so that the generic styles are put to the new class `.gg-button` we introduced earlier

```css

button.gg-button.-size-regular {
    border-radius: 6px;
    padding: 8px;
}

button.gg-button.-size-large {
    border-radius: 4px;
    font-weight: bold;
    padding-top: 14px;
    padding-bottom: 14px;
    padding-left: 20px;
    padding-right: 20px;
    outline: none;
}

button.gg-button:focus, button.gg-button:active{
    outline: none;
}

button.gg-button.-color-main:active {
    color: white;
    background: #DF6E11;
    border: 2px solid #DF6E11;
}

button.fill-border.-color-main {
    border: 2px solid #F28123;    
    background: white;    
}

button.fill-background.-color-main {    
    color: white;
    border: 2px solid #F28123;
    background: #F28123;

    -webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;
}
```

We can also add some defaults to the button so that if we don't specify a fill, it will default to "background":

```js
Button.defaultProps = {
    fill: 'background',
    size: 'regular',
    className: '',
};
```