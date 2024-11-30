// bun example/test1.ts
import Type, {
    isOptional,
    length,
    max, min,
    number, optional,
    regex,
    string
} from '../src/type.ts';
import { isString } from '../src/util.ts';

const email = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return isString(value) && emailPattern.test(value);
}

const Pet = new Type({
    name: string,
    animal: [['cat', 'dog']]
});

const PersonType = new Type({
    profile: {
        fullName: string | optional,
        age: [[max, 10], [min, 5]],
        name: [[isOptional], [isString], [length, [3, 5]]],
        email: [[email]],
        height: [[regex, /^\d+cm$/]],
        weight: string | number,
        pets: [Pet],
        books: [{
            name: string
        }],
    }
});

const person = {
    profile: {
        // fullName: 'David Copperfield',
        age: 4,
        // name: 'David',
        email: 'david@gmail.com',
        height: '170cm',
        weight: '65kg',
        pets: [{
            name: 'Kitty',
            animal: 1
        }],
        books: [{
            name: 'Harry Porter'
        }, {
            name: 'How to win friends and Influence People'
        }]
    }
};

const errors = PersonType.validate(person);
console.log('Error:', errors);

try {
    PersonType.assert(person);
} catch(error) {
    console.error('Error:', error.message);
}

