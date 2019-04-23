# Firebase in React Setup

To start, sign up on the official Firebase website [click here](https://firebase.google.com/). After you have created a Firebase account, you should be able to create projects and be granted access to the project dashboard.

## Step 1

Before doing anything in firebase, let's install firebase to our app so that we can work on creating the project while it's installing:

```bash
# bash
npm install firebase
```

## Step 2

Click on __"Add project"__ and a modal should show up. Fill up the form with any name you like (make sure to remember it) and change the location to __Philippines__, leave __Cloud Firestore location__ as is and check all checkboxes.

## Step 3

Next, find the project’s configuration in the settings on your project’s dashboard. There, you’ll have access to all the necessary information: secrets, keys, ids and other details to set up your application. Copy these in the next step to your React application.

The button to open this up should look like this:

![Firebase Add to App Button](/img/firebase-add-to-app-button.png)

Which should show a modal titled: __"Add Firebase to your web app"__

## Step 4

We'll go back to our application and create a wrapper class for handling firebase interactions.