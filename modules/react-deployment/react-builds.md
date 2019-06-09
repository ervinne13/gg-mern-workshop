# Builds and Basic Deployment

So far we've developed our application in dev mode. In this section, we will be learning how to generate production builds of our application and explore. We will also explore how to deploy on two platforms, a VPS with a reverse proxy, and to github.io to serve static pages.

This section will be continued again later after we learn about express development. At that point, learners will be exposed on very similar approach but this time, configuring reverse proxies to run express instead of static pages.

## Building for Production

To build your appliction to be ready for production is easy. Simply run:

```bash
npm build
```

This would create a new folder at the root of your application called `/build` that contains the production version of your appliction.

Open the file `index.html` in your browser and it should run your application.

## Basic Deployment

Now we can deploy our react app, we'll go through two ways on how you may deploy static websites created in react:

1. [Deploying static websites in NGINX](/modules/react-deployment/nginx-deployment-static-sites.md)
2. [Deploying static websites to github.io](/modules/react-deployment/githubio.md)