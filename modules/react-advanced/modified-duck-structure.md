# Modified Duck Structure

A lot of developers organize their code by function. This okay for small projects but the instructor would argue that this will grow to be difficult to maintain in the future.

## Duck Structure

Duck structure is simply organizing code by feature instead of function. See below:

![Function vs Feature Structuring](/img/function-vs-feature-structure.png)

## Principle of Least Knowledge

In a way, organizing your code by feature would better allow adherence to principle of least knowledge. Imagine that you have a component that uses react and another one that doesnt, the component that would use these components would have to import from container and component respectively. This would then require the users of these component to know about whether or not a component uses redux or not. An information that the client component has nothing to do with.

Organizing by function - not adhering to PLK
```jsx
import ReduxBasedComponent from 'Containers/ReduxBasedComponent';
import NonReduxComponent from 'Components/NonReduxComponents';
```

__VS__

Organizing by feature - adherence to PLK

```jsx
import ReduxBasedComponent from 'Auth/ReduxBasedComponent';
import NonReduxComponent from 'Products/NonReduxComponents';
```

## Common Features

Separation by feature is good and all, but there are cases where it really makes sense to separate something by function, like layouts.

A layout is something that's reusable all throughout the application, which merits its own folder.

So how do we structure? We'll introduce a "Common" folder which would contain anything that can't fall into a feature.

## Basic Structure

Let's say we have an application with an authentication feature. We'll create the following structure:

![Duck Structure](/img/duck-structure-01.png)

## Handling Container - Component Pairs in Redux

Even with this structure, we'll still violate principle of least knowledge if we imported something like `Auth/LoginContainer`. A better way should be to import `Auth/LoginScene` since the login in this case is a page.

We can do this by wrapping both component and container in the same folder:

![Duck Structure](/img/duck-structure-02.png)

This is still not enough though. We need to tell the import that if we imported `Auth/LoginScene`, it should point to the container not to the component.

Well we can rename the container into index.js but that would flood vscode with a lot of index.js when we search for it.

## Directory Descriptors

The file `package.json` has many uses, one of it is describing directories. In the `src/Auth/LoginScene` folder, create a new file called `package.json` and add the contents:

```json
{
    "main": "./Container.js"
}
```

This way, we can keep the integrity of our file names while enabling proper imports. What's more, since the users of the components do not need to know bet. containers and components, the same import can be used for the same component with or without a container.

Imagine if you don't currently need to use redux on a certain component yet, then suddenly a feature change comes in and now you do. If that component is used by a lot of other components, you will then have to change all of the references to that component. Whereas if you implemented this structure, just introduce a folder and a directory descriptor and you won't have to change a thing in the other components.

This is also effectively adherence to Single Responsibility Principle in SOLID principles.

## Enabling Auto Paths

You should notice that this should still not work as ES6 imports are relative. We can create auto aliases by automatically mapping the src folder to the paths in the `compilerOptions` of a jsconfig.

Create a file called `jsconfig.json` in the root of your project with the following contents:

```json
{
    "compilerOptions": {
        "jsx": "react", 
        "baseUrl": "./src",
        "paths": {
            "/*": ["/*"]
        }
    }
}
```

# Other Structure Options - Best of Both Worlds

In some cases, you might feel like putting every feature in the `src` folder can make it cramped. Also, what if you need to have one or more configurations written in JS or JSON?

Another option is to separate by function minimally, then by feature inside.

In this case though, the instructor would recommend separating layouts from components. `Scenes` or `Features` (whichever you like better) to describe features, `Components` for generic and reusable components (customized inputs, reusable views, etc.), and finally, `configs` for configuration.

We'll use small cases this time to make distinction with configs, the rest stays as camel case.

`jsconfig.json` must then be updated to be like below:

```json
{
    "compilerOptions": {
        "jsx": "react", 
        "baseUrl": "./src",
        "paths": {
            "/*": ["/*"]
        }
    }
}
```

## Structuring by Scene

A "Scene" or a "Page" is a functional concept so your import and structuring style will be more on the functional side than features:

![Duck Structure](/img/duck-structure-03.png)![]

Importing would then look something like this:

```jsx
import LoginScene from 'Scenes/Login';
```

Note that you may (and you should) change the name of the import to be more appropriate. In a lot of tutorials, what you would see is:

```jsx
//  bad, ambiguous
import Login from 'Scenes/Login';
```

... because you are importing `Login` from `Scenes`. It's better to be explicit instead to avoid conflicts later on for ambiguous names that depend on the context (folder) their in.

## Structuring by Feature

The instructor would prefer structuring by feature instead. This would also allow you to write components that technically belongs to a certain feature but can be reused by other components without moving these components up to the components or common folder.

With this though, you will likely not need the "Components" folder anymore.

![Duck Structure](/img/duck-structure-04.png)![]

Follow through the instructor as he further explains each content.

# General Guideline

Whatever you choose, it's okay, your only guideline is that __your application should not be bound by Redux or any other library!__

In usual development scenarios, you'll have to try to create your applications without redux first and only use it when necessary. Such evolution is difficult to manage if your structure is dependent on a 3rd parth library.