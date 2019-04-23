# React Development Basics

## Thinking in React (Intro)

When developing React based applications, one must remember our previous lesson __"Atomic Design"__. In general, the steps you must follow is:
1. Start with a mock
2. Extract data from it (if there are any) into a JSON object/array
3. Break the UI into a component heirarchy (as you would in atomic design)
4. Build a static version in React
5. Identify the minimal (but complete) representation of the UI state
6. Identify where your state should live
7. Add inverse data flow

We can pretty much understand steps 1 - 5 but we'll have to discuss more for steps 6 and 7.

The instructor will now walk you through the basics and at the end of this session, we must be able to create simple frontend applications with these steps (as long as we're given a mock first of course).

## JSX And Coupled UI & Behavior

We've emphasized that React development is pretty much atomic design. But aside from the granular design, React __*embraces the fact that rendering logic is inherently coupled with other UI logic: how events are handled, how the state changes over time, and how the data is prepared for display.*__ So instead of having a controller of sorts (in MVC and MVVM structured applications), the behavior exists in the same place as the UI __but is granular like the components.__

Instead of artificially separating technologies by putting markup and logic in separate files, React separates concerns with loosely coupled units called “components” that contain both. We will come back to components in a further section, but if you’re not yet comfortable putting markup in JS, this talk might convince you otherwise.

## Learning Through Activities

We'll be learning JSX and other React concepts through a series of activities. To do that, set up your project using create react app.

If you haven't installed CRA (Create React App) yet, install with:

```bash
# bash
npm install -g create-react-app
```

Then create a scratch react app for us to use as "scratch paper".

```bash
# bash
create-react-app scratch
```

Follow the instructor as he discuss the following:

- [Examining CRA Structure](/modules/react-basics/cra-structure.md)