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
import BorderedButton from '../../src/App/Client/Common/Components/BorderedButton';BorderedButtonComponent';

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

Notice that we're using a relative path of the component. This is because storybook is not covered by our CRA webpack, thus it will not load our components the same way that we can omit `/src/`.

Now your storybook should look something like:

![Storybook 02](/img/storybook-02.png)

## Implementing Google Auth Button From Bordered Button

If you use Adobe XD, you can select icons that we've imported there and export them as SVG. We can then use them in our application.

Create a new folder `App/Client/Features/Landing/GoogleLoginButton` and paste the svg icon there
