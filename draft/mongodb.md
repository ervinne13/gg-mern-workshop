# NoSQL & MongoDB Reference

## NoSQL

Relational databases were never designed to cope with the scale and agility challenges that face modern applications – and aren't built to take advantage of cheap storage and processing power that's available today through the cloud. Relational database vendors have developed two main technical approaches to address these shortcomings:

NoSQL encompasses a wide variety of different database technologies but generally all NoSQL databases have a few features in common.

### Dynamic schemas

Relational databases require that schemas be defined before you can add data. For example, you might want to store data about your customers such as phone numbers, first and last name, address, city and state – a SQL database needs to know this in advance.

This fits poorly with agile development approaches, because each time you complete new features, the schema of your database often needs to change. So if you decide, a few iterations into development, that you'd like to store customers' favorite items in addition to their addresses and phone numbers, you'll need to add that column to the database, and then migrate the entire database to the new schema.

If the database is large, this is a very slow process that involves significant downtime. If you are frequently changing the data your application stores – because you are iterating rapidly – this downtime may also be frequent. There's also no way, using a relational database, to effectively address data that's completely unstructured or unknown in advance.

__NoSQL databases are built to allow the insertion of data without a predefined schema.__ That makes it easy to make significant application changes in real-time, without worrying about service interruptions – which means development is faster, code integration is more reliable, and less database administrator time is needed.

### Auto-sharding, replication and integrated caching

Because of the way they are structured, relational databases usually scale vertically – a single server has to host the entire database to ensure reliability and continuous availability of data. This gets expensive quickly, places limits on scale, and creates a relatively small number of failure points for database infrastructure.

The solution is to scale horizontally, by adding servers instead of concentrating more capacity in a single server. Cloud computing makes this significantly easier, with providers such as Amazon Web Services providing virtually unlimited capacity on demand, and taking care of all the necessary database administration tasks. Developers no longer need to construct complex, expensive platforms to support their applications, and can concentrate on writing application code. In addition, a group of commodity servers can provide the same processing and storage capabilities as a single high-end server for a fraction of the price.

"Sharding" a database across many server instances can be achieved with SQL databases, but usually is accomplished through SANs and other complex arrangements for making hardware act as a single server. NoSQL databases, on the other hand, usually support auto-sharding, meaning that they natively and automatically spread data across an arbitrary number of servers, without requiring the application to even be aware of the composition of the server pool. Data and query load are automatically balanced across servers, and when a server goes down, it can be quickly and transparently replaced with no application disruption.

Most NoSQL databases also support automatic replication, meaning that you get high availability and disaster recovery without involving separate applications to manage these tasks. The storage environment is essentially virtualized from the developer's perspective.

Lastly, many NoSQL database technologies have excellent integrated caching capabilities, keeping frequently-used data in system memory as much as possible. This removes the need for a separate caching layer that must be maintained.

### NoSQL Database Types

Since "NoSQL" just means non-relational and not SQL, there are many different ways to implement NoSQL technology. Generally, NoSQL databases include the following families:

- __Key-value stores__ are the simplest NoSQL databases. Every single item in the database is stored as an attribute name, or key, together with its value. Examples of key-value stores are Riak and Voldemort. Some key-value stores, such as Redis, allow each value to have a type, such as "integer", which adds functionality.

- __Document databases__ pair each key with a complex data structure known as a document. Documents can contain many different key-value pairs, or key-array pairs, or even nested documents.

- __Wide-column stores__ such as Cassandra and HBase are optimized for queries over large datasets, and store columns of data together, instead of rows.

- __Graph stores__ are used to store information about networks, such as social connections. Graph stores include Neo4J and HyperGraphDB.


<div style="text-align: right">
- MongoDB Website
</div>

## Clusters

A mongodb cluster is the word usually used for __sharded cluster__ in mongodb. The main purposes of a sharded mongodb are:

- Scale reads and writes along several nodes
- Each node does not handle the whole data so you can separate data along all the nodes of the shard. Each node is a member of a shard (which is a replicaset, see below for the explanation) and the data are separated on all shards.

This is the representation of a mongodb sharded cluster from the official [doc](https://docs.mongodb.com/v3.0/core/sharding-introduction/):

![Sharding](https://i.stack.imgur.com/zCOvb.png)

