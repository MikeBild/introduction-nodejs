function add(x, y) {
	return x + y;
}

function newAdd(x) {
	return (y) => {
		return x + y;
	};
}

const newAdd1 = newAdd(1);
const newAdd2 = newAdd(2);

console.log(newAdd1(2));
console.log(newAdd2(2));

function add1(x) {
	return add(x, 1);
}

function add2(x) {
	return add(x, 2);
}

console.log(add(1, 2));
console.log(add1(2));
console.log(add2(2));
