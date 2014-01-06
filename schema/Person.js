var Person = function(node) {
	Thing.apply(this, arguments);
};

Person.prototype = Object.create(Thing.prototype);
