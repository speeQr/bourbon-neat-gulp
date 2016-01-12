const myVar = 0;

function f(x, y, ...a) {
    return (x + y) * a.length;
}
f(1, 2, "hello", true, 7) === 9;

var cat = {
	meow(times) {
		console.log("meow".repeat(times));
	}
};

cat.meow(3);