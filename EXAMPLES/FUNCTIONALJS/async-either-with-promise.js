#!/bin/env node
//thx to http://fsprojects.github.io/Chessie/a-tale-of-3-nightclubs.html

Promise.all([
  suitablePersonEnterGayBar(),
  unsuitablePersonEnterGayBar(),
])
.then(result => result.map((person, i) => `Person ${i+1}: ${person.cost || ''}${person.reasons.join(' ')}`))
.then(result => console.log(`Person entries\n${result.join('\n')}`));

module. exports = () => {
  return {
    Person: Person,
    enterGayBar: enterGayBar,
    costToEnter: costToEnter,
    checkClothes: checkClothes,
    checkAge: checkAge,
    checkGender: checkGender,
  };
};

function suitablePersonEnterGayBar() {
  return enterGayBar(new Person('Male', 24, ['Shirt']));
}

function unsuitablePersonEnterGayBar() {
  return enterGayBar(new Person('Male', 17, ['Tie']));
}

function Person (gender, age, clothes, sobriety) {
	this.gender = gender;
	this.age = age;
	this.clothes = clothes || [];
	this.sobriety = sobriety  
}

function enterGayBar (person) {
	return costToEnter(person, [checkGender, checkAge, checkClothes])
  .then(data => ({cost: data, reasons: []}))
  .catch(err => ({reasons: err}));
}

function costToEnter (person, rules) {
	const initial =  {
		failures: [],
		success: person.gender === 'Female' ? 0 : 5,
	};

	return Promise
  .all(rules.map(fn => fn(person).catch(err => err)))
  .then(results => {			
    const result = results.reduce((state, result) => {
      if(result.message) state.failures.push(result.message);
      return state;
    }, initial);
    
    if(result.failures.length > 0) return Promise.reject(result.failures);
    return Promise.resolve(result.success);
  });
}

function checkClothes (person) {
	if(person.gender === 'Male' && person.clothes.indexOf('Tie') !== -1) return Promise.reject(new Error('Smarten up!'));
	if(person.gender === 'Female' && person.clothes.indexOf('Trainers') !== -1) return Promise.reject(new Error('Smarten up!'));
	return Promise.resolve(person);
}

function checkAge (person) {
	if(person.age < 18) return Promise.reject(new Error('Too young!'));
	if(person.age > 40) return Promise.reject(new Error('Too old!'));
	return Promise.resolve(person);
}

function checkGender (person) {
	if(person.gender === 'Female') return Promise.reject(new Error('Men only!'));
	return Promise.resolve(person);
}