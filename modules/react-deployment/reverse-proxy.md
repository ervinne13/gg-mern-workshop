# Node based Applications with Reverse Proxies

To say that Node.js is Production-Ready is certainly an understatement. However, there’s one piece of advice which has held true since Node.js’s inception: one should not directly expose a Node.js process to the web and should instead hide it behind a reverse proxy. But, before we look at the reasons why we would want to use a reverse proxy, let’s first look at what one is.

## What is a Reverse Proxy?

A reverse proxy is basically a special type of web server which receives requests, forwards them to another HTTP server somewhere else, receives a reply, and forwards the reply to the original requester.

A reverse proxy doesn’t usually send the exact request, though. Typically it will modify the request in some manner. For example, if the reverse proxy lives at www.example.org:80, and is going to forward the request to ex.example.org:8080, it will probably rewrite the original Host header to match that of the target. It may also modify the request in other ways, such as cleaning up a malformed request or translating between protocols.

## Why should I use a Reverse Proxy?

- SSL
- Ease of configuration for security and performance
- Clustering
- Enterprise Routing
- Performance Benefits
- Simplified Application Code

### Enabling SSL / SSL Termination

SSL termination is one of the most popular reasons one uses a reverse proxy. Changing the protocol of ones application from http to https does take a little more work than appending an s. Node.js itself is able to perform the necessary encryption and decryption for https, and can be configured to read the necessary certificate files.

However, configuring the protocol used to communicate with our application, and managing ever-expiring SSL certificates, is not really something that our application needs to be concerned about. Checking certificates into a codebase would not only be tedious, but also a security risk. Acquiring certificates from a central location upon application startup also has its risks.

### Ease of configuration for security and performance

Normally, you'll have your application scanned for peformance and security. Security scanners would often give you reports about security concerns such as disabling a certain response header. Doing that with a reverse proxy like NGINX is a lot easier, not to mention, many security scanning services already have solutions for NGINX or Apache (which we can't use since that's for PHP). The same goes for performance scanners.

For better performance, gzip compression is another feature which you should offload from the application to a reverse proxy. gzip compression policies are something best set at an organization level, instead of having to specify and configure for each application.

### Clustering

JavaScript is a single-threaded language, and accordingly, Node.js has traditionally been a single-threaded server platform (though, the currently-experimental worker thread support available in Node.js v10 aims to change this). This means getting as much throughput from a Node.js application as possible requires running roughly the same number of instances as there are CPU cores.

Node.js comes with a built-in cluster module which can do just that. Incoming HTTP requests will be made to a master process then be dispatched to cluster workers.

However, dynamically scaling cluster workers would take some effort. There’s also usually added overhead in running an additional Node.js process as the dispatching master process. Also, scaling processes across different machines is something that cluster can’t do.

For these reasons it’s sometimes better to use a reverse proxy to dispatch requests to running Node.js processes. Such reverse proxies can be dynamically configured to point to new application processes as they arrive. Really, an application should just be concerned with doing its own work, it shouldn’t be concerned with managing multiple copies and dispatching requests.

### Enterprise Routing

When dealing with massive web applications, such as the ones built by multi-team enterprises, it’s very useful to have a reverse proxy for determining where to forward requests to. For example, requests made to example.org/search/* can be routed to the internal search application while other requests made to example.org/profile/* can be dispatched to the internal profile application.

### Performance Benefits

Node.js is highly malleable. It is able to serve static assets from a filesystem, perform gzip compression with HTTP responses, comes with built-in support for HTTPS, and many other features. It even has the ability to run multiple instances of an application and perform its own request dispatching, by way of the cluster module.

And yet, ultimately it is in our best interest to let a reverse proxy handle these operations for us, instead of having our Node.js application do it. Other than each of the reasons listed above, another reason for wanting to do these operations outside of Node.js is due to efficiency.

SSL encryption and gzip compression are two highly CPU-bound operations. Dedicated reverse proxy tools, like Nginx and HAProxy, typically perform these operations faster than Node.js. Having a web server like Nginx read static content from disk is going to be faster than Node.js as well. Even clustering can sometimes be more efficient as a reverse proxy like Nginx will use less memory and CPU than that of an additional Node.js process.

### Simplified Application Code

The biggest benefits of off loading work from a Node.js application to a reverse proxy is that of code simplicity. You should know by know that your instructor really likes to separate things by concern and NGINX helps us a lot with that by removing many technical details in our code. We get to reduce the number of lines of potentially-buggy imperative application code and exchange it for declarative configuration.

Instead of installing and managing gzip compression middleware and keeping it up-to-date across various Node.js projects we can instead configure it in a single location. Instead of shipping or downloading SSL certificates and either re-acquiring them or restarting application processes we can instead use existing certificate management tools. Instead of adding conditionals to our application to check if a process is a master or worker we can offload this to another tool.

__A reverse proxy allows our application to focus on business logic and forget about protocols and process management.__

## In Summary

Even though Node.js is perfectly capable of being run in production, using a reverse proxy with production HTTP Node.js applications offers a myriad of benefits. Operations like SSL and gzip become faster. Management of SSL certificates can become simpler. The amount of application code required is also reduced. I highly encourage you to use a reverse proxy with your next production Node.js application.