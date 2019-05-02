function foo() {
    console.log( this.a );
}

function doFoo(fn) {
    //  ... do some things here, usually asynchronous stuff
    // `fn` is just another reference to `foo`
    fn(); // <-- call-site!
}

var obj = {
    a: 2,
    foo: foo
};

var a = "oops, global"; // `a` also property on global object

doFoo( foo.bind(obj) ); // 2 | yey