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

Note: In the instructor's experience with windows, the arrow keys does not work well with git bash unlike in Ubuntu's terminal. If your arrow keys does not work when firebase prompts for options, use your regular CMD.

Firebase will ask you to select from projects, select the project that we created earlier.

## Running & Deploying Our Project

Run the command:

```bash
firebase serve
```

... to create start up a new server that will hosts the files in our project.

You should notice that this server runs the files in our public directory of our project.

If in case it's unable to get your project, explicity set it by using the command:

```bash
firebase use <your project id here>
```

We may also deploy our application to firebase itself by running:

```bash
firebase deploy
```

Which will upload and give you a url where you may now access your application.

## Into Development

Let's first clean up our index.html file, remove the style, and the body content and just leave the required imports from firebase. It should look something like:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My Firebase App</title>

    <!-- update the version number as needed -->
    <script defer src="/__/firebase/6.0.4/firebase-app.js"></script>
    <!-- include only the Firebase features as you need -->
    <script defer src="/__/firebase/6.0.4/firebase-auth.js"></script>
    <script defer src="/__/firebase/6.0.4/firebase-database.js"></script>
    <script defer src="/__/firebase/6.0.4/firebase-messaging.js"></script>
    <script defer src="/__/firebase/6.0.4/firebase-storage.js"></script>
    <!-- initialize the SDK after all desired features are loaded -->
    <script defer src="/__/firebase/init.js"></script>
  </head>
  <body>

  </body>
</html>
```

Inside the body, add:

```html
<script src="app.js"></script>
```

and create the `app.js` file so we can start doing some tests to firebase.

## Google Authentication with Firebase

The first feature we want to explore is authenticating in firebase.

Let's first add a button that may trigger this:

```html
<button onclick="loginWithGoogle()">Login with Google</button>
```

... and in `app.js` add the following code:

```js
document.addEventListener("DOMContentLoaded", e => {
    const app = firebase.app();
    console.log(app);
});
```

For now, we'll inspect what's in our app in firebase to check if firebase is really loaded.

### Enabling Authentication

Go back to your firebase console and go to the Develop > Authentication left nav. Click on the "Sign-in method" tab and enable google login.

Next add our implementation of google login:

```js
const loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            console.log(user);
            document.write(`Hello ${user.displayName}`);
        });
}
```

That's it! That's all the code it takes to allow google authentication in firebase. This will also update the body of your application once authentication is done.

With google's latest updates though, you will likely get a "Error 403: restricted_client" error.

To resolve this, click the "Learn more" link google provided and add links to Homepage, Privacy Policy, and Terms of Service. For now just put any valid link to firebase to it. The instructor will put `https://tasks-01-a126d.firebaseapp.com` where `tasks-01-a126d` is the id of your project.

Also add in a Support email to enable save, then save your changes.

Try again and it should now authenticate your user.

## Creating a Collection

Go to Develop > Database and create a database. Click "Start in test mode" so we can use the database freely.

Add a new collection called "`tasks`" and write anything you like as it's first document inside.

## Retrieving Data

Create a new button to log our tasks:

```html
<button onclick="logTasks()">Log Tasks</button>
```

... then implement it in our application:

```js
const logTasks = () => {    
    const firestore = firebase.firestore();
    const taskCollection = firestore.collection('tasks');

    taskCollection.get()
        .then(result => {
            result.forEach(doc => {
                console.log(doc.data());
            })
        });
};
```

You will most likely encounter an issue that firestore is not defined. To fix this, add the import:

```html
<script defer src="/__/firebase/6.0.4/firebase-firestore.js"></script>
```

This will then log all the documents inside that collection.

### Querying

Let's first create a new collection called `people`.
Inside it, create the values:

```json
[
    {"name": "Ervinne"},
    {"name": "John Doe"},
    {"name": "Doris"},    
]
```

Create a button to trigger a function we'll create:

```html
<button onclick="query()">Query People</button>
```

... and the query function:

```js
const query = () => {
    const firestore = firebase.firestore();
    const peopleCollection = firestore.collection('people');

    peopleCollection
        .where('name', '==', 'Doris')
        .get()        
        .then(result => {
            result.forEach(doc => {
                console.log(doc.data());
            })
        });
};
```

The full documentation can be referenced [here](https://firebase.google.com/docs/firestore/query-data).

For more complex queries, [click here](https://firebase.google.com/docs/firestore/query-data/queries) to reference.

You may also get a specific document by using the `doc` function instead of `get`. Just provide the id of the document.

## Persisting Data

Let's first implement adding data
Do the same as above to create a button that invokes the function:

```js
const add = () => {
    const firestore = firebase.firestore();
    const peopleCollection = firestore.collection('people');

    peopleCollection.add({
        name: "Angel"
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
};
```

Now we can also "set" or update that data by:

```js
const update = () => {
    const firestore = firebase.firestore();
    const peopleCollection = firestore.collection('people');

    peopleCollection.doc("ydTrVgiQCWXasLUgGGth").set({
        name: "Angel - Updated"
    })
    .then(function(docRef) {
        console.log("Document updated!");
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
};
```

Where `ydTrVgiQCWXasLUgGGth` is the id of the document we want to update.

## Deleting Records

To delete, just use the `delete` function in place of `add` or `set`:

```js
const remove = () => {
    const firestore = firebase.firestore();
    const peopleCollection = firestore.collection('people');

    peopleCollection.doc("ydTrVgiQCWXasLUgGGth")
    .delete()
    .then(function(docRef) {
        console.log("Document deleted!");
    })
    .catch(function(error) {
        console.error("Error deleting document: ", error);
    });
};
```

## Realtime Listening to Updates

Write a new function to "load" a record based on a snapshot and add a button for it.

```js
const load = () => {
    const firestore = firebase.firestore();
    const peopleCollection = firestore.collection('people');

    peopleCollection
        .doc("8oXHW3nvBpqooXN4IRMd")        
        .onSnapshot(result => {
            document.querySelector('#person').innerHTML = result.data().name;
        });
}
```

Then add the following markup to your html:

```html
<button onclick="load()">Load Person</button>
<div id="person"></div>
```

You may also listen to the whole collection by not specifying `doc` or writing a query.

Editing that record in your markup will also enable optimistic updates.

## Optimistic Updates / Latency Compensation

When you've set up `onSnapshot` to a document and tried to do updates to that document. Firebase does something called "Optimistic updates" or "Latency compensation".

In your test application, open up the developer tools by pressing `f12`. In the `Network` tab, click on "No throttling" and change it to "Slow 3g" to simulate a slow connection.

Clear your network history if it's not cleared yet and watch while you do a change to your form.
You should notice that 