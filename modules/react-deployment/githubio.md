# Deploying React to Github.io

Github.io or Github Pages allow you to host static websites with 0 cost. This is very ideal in making your own portfolio.

More information [here](https://pages.github.com/).

## Creating Your Own Page

Create a new repository with the name:

    `<yourusername>.github.io`
    Ex.
    gg-ervinne.github.io

## Telling React to Automatically Update Your Site

We need some sort of setup so that it's not so tedious to manually update a separate repository over and over.

In your projects folder (wherever you put your react projects on), create a new folder with the same name as your github pages project, in this case `gg-ervinne.github.io`. Make sure that your react project folder and the github io project is in the same folder and in the same level.

Inside `gg-ervinne.github.io`, run the commands:

```bash
git remote add origin https://github.com/gg-ervinne/gg-ervinne.github.io.git
```

(commands taken from when you create a new repository in git)

Next, in your react project, update the `package.json` and add a new command: `build-github-page`:

```json
    "build-github-page": "react-scripts build && rm -rf ../gg-ervinne.github.io/* && mv build ../gg-ervinne.github.io/",
```

Your `scripts` should now look like:

```json
{
  "name": "gg-portfolio",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "react-scripts": "3.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "build-github-page": "react-scripts build && rm -rf ../gg-ervinne.github.io/* && mv build/* ../gg-ervinne.github.io/",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  //    ...
```

Build the page by running:

```bash
npm run build-github-page
```

Check the contents of the github io project and it should now contain the production files. Add, commit and push it to master to deploy:

```bash
git add .
git commit -m "Apply auto built contents from React project"
git push origin master
```

After several seconds, check your deployed project in your github page, in this case, in https://gg-ervinne.github.io.