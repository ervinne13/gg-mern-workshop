# MERN Full-Stack Development

## What You'll Need For This Workshop

Downloadables:
- NodeJS [Download Here](https://nodejs.org/en/download)
- Git [Download Here](https://git-scm.com/downloads)
- Create React App (Setup Below)
- Postman [Download Here](https://www.getpostman.com/downloads/)
- MongoDB Community [Download Here](https://www.mongodb.com/download-center#community)
    - Make sure to install MongoDB Compass as well

If you're using Ubuntu or MongoDB Compass is not available, you may also use:
- Robo3T [Download Here](https://robomongo.org/)

## Checklist

Let's make sure everything works well. Open up your terminal.

__Testing Node & NPM__
```bash
#### Run
node -v
#### Outputs something like:
v10.15.3

#### Run
npm -v
#### Outputs something like:
6.4.1
```

Make sure to install Node version 8 and above.

__Testing Git__
```bash
#### Run
git --version

#### Outputs something like:
git version 2.19.1
```

If any of the command results in `command not found` or anything similar, please refer back to the appropriate installation procedure.

## Installing Create React App

In your terminal, run:

```bash
# bash

npm install -g create-react-app
```

## Learning Objectives

 - Improve learners' skill in JavaScript by imparting the best practices and lesser known must do's
 - Train learners in developing application in MERN stack focusing on front end (React)
 - Introduce learners on their options for using databases (local storage, serverless architecture, MLab, Firebase, and local MongoDB)
 - Train learners in using source control management with GIT
 - Introduce learners into deploying their applications in a VPS with NGINX reverse proxy

## The Workshop Contents:

### The fundamentals
- 01 [JavaScript Fundamentals](/modules/js-basics/index.md)
- 02 [Object Oriented & Functional Programming in JS](/modules/oop-fp/index.md)
- 03 [Source Control Management](/modules/git.md)

### React
- 04 [Atomic Design]()
- 05 [React Basics](/modules/react-basics/index.md)
- 06 [Builds & Basic Deployment](/modules/react-deployment/react-builds.md)
- 07 [Ejection From "Create React App" & Introduction to Webpack](/modules/react-advanced/eject.md)

### Real World Development

For this part of the session we'll be learning more through development of an application instead of just discussions.

- 08 [Structuring & Routing React](/modules/todo/setting-up-structure-and-routes.md)
- 09 [Building the Application UI from XD (An application of atomic design)](/modules/todo/storybook.md)
- 10 [Adding Behavior With Redux](/modules/todo/redux.md)
- 11 [Google Authentication with Firebase](/modules/todo/firebase-auth.md)
- 12 [Persistence with Firestore](/modules/todo/firebase-persistence.md)

### Remaking the Project with Express Backend 

- 13 [NodeJS & Express]()
- 14 [Building the APIs ReSTfully]()