var Person = function(node) {
	Thing.apply(this, arguments);
};

Person.prototype = new Thing;