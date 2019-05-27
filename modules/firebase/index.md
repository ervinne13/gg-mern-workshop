# Software Development with Firebase

Serverless architecture is getting all the hype nowadays. Serverless does not literally mean you don't have a server, it means you don't have to manage a lot of things in the server side and can now concentrate on developing on the frontend of your application.

That's where technologies like firebase comes in. Firebase is a collection of technologies that allow for rapid application development

For easier application development with firebase, install firebase tools with:

```bash
npm install -g firebase-tools
```

## Creating a Project in Firebase

Go to the firebase console after registration: https://console.firebase.google.com

Click `+ Add Project` to create a new project. For now, let's name this "Test Project". __Make sure to change the location to Philippines.__

## On to Development

Create a new folder that will contain our new project. In this case create a folder: `/c/firebase/test-project`. Then run the command:

```bash
firebase init my-app
```

If in case it returns an error that you should be logged in first. run:

```bash
firebase login --interactive
```

It should generate a link for you to visit so you may login or automatically open a browser for you. Login to the browser and your CLI should automatically be logged in for you.

Then run the `firebase init hosting` again to finally create your application.

Note: In my experience with windows, the arrow keys does not work well with git bash unlike in Ubuntu's terminal. If your arrow keys does not work when firebase prompts for options, use your regular CMD.

Firebase will ask you to select from projects, select the project that we created earlier.

## Running & Deploying Our Project

Run the command:

```bash
firebase serve
```

... to create start up a new server that will hosts the files in our project.

You should notice that this server runs the files in our public directory of our project.

We may also deploy our application to firebase itself by running:

```bash
firebase deploy
```

Which will upload and give you a url where you may now access your application.

## Creating your First Firestore

TODO

## Optimistic Updates / Latency Compensation

When you've set up `onSnapshot` to a document and tried to do updates to that document. Firebase does something called "Optimistic updates" or "Latency compensation".

In your test application, open up the developer tools by pressing `f12`. In the `Network` tab, click on "No throttling" and change it to "Slow 3g" to simulate a slow connection.

Clear your network history if it's not cleared yet and watch while you do a change to your form.
You should notice that 