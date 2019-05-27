# Relational Data in NoSQL

When trying to do data modeling in NoSQL database, you will have to unlearn a lot of concepts that you may already know when dealing with SQL databases.

## Collections & Documents

If ever you did Lotus Notes in the past, it's almost exactly the same.
NoSQL keeps data as documents grouped by collections. A collection does not have data on their own, they just hold together documents which have the actual data.

## Best Practices

Keep your collections big, while your documents small. It's normally bad to create (pseudo) collections inside documents as this will make querying and maintaining your data later on difficult. Follow along the instructor as he shows some of the real world bad practices that in general, you should avoid.

A collection can have millions of records and can still be queried efficiently but that's not usually the case if you write large documents inside it. Documents are just basically json objects, so you can add in objects and arrays inside it but be warned that you should not abuse this.