const { GraphQLServer, PubSub } = require('graphql-yoga');
const db = require('./db');

const pubsub = new PubSub();

let personsLeft = db;
let turn = 0;
let message = '';
let eliminated = [];

let state = {
    personsLeft,

    turn,
    message,
    eliminated,
    reset: () => {
        state.personsLeft = db;
        state.turn = 0;
        state.message = 'New game.';
        eliminated = [];
    }
};

let names = db.map(person => person.name.toUpperCase());
let id = db.length;

function getRandomPerson() {
    const randomNumber = Math.floor(Math.random() * (db.length + 1)); 
    return db[randomNumber];
}

let myPerson = getRandomPerson(); 

function checkState() {
    
    pubsub.publish();

    if (state.personsLeft.length === 1) {
        state.message =
            `Congratulations! You found out that I thought of ${myPerson.name.toUpperCase()} in ${state.turn} turns!`
    }
}

function eliminate(prop, value, hasValue) {
    state.eliminated = hasValue ?
        state.personsLeft.filter(person => person[prop] !== value) :
        state.personsLeft.filter(person => person[prop] === value);

    state.personsLeft = state.personsLeft
        .filter(person => !state.eliminated.includes(person));
}

const typeDefs = `
    type Person {
        id: Int!
        name: String!
        hairColor: HairColor!
        hairStyle: HairStyle!
        hat: Boolean!
        nose: Size!
        beard: Boolean!
        gender: Gender!
        glasses: Boolean!
        eyeColor: EyeColor!
        mouth: Size!
    }

    type State {
        personsLeft: [Person!]!
        eliminated: [Person!]!
        turn: Int!
        message: String!
    }

    type Query {
        state: State!
        hairColor(attr: HairColor!): State!
        hairStyle(attr: HairStyle!): State!
        hat: State!
        nose(attr: Size!): State!
        beard: State!
        gender(attr: Gender!): State!
        glasses: State!
        eyeColor(attr: EyeColor!): State!
        mouth(attr: Size!): State!
        name(attr: String!): State!
        restart: State!
    }

    type Mutation {
        addPerson(attr: PersonInput!): Person
        deletePerson(attr: String!): Person
    }

    type Subscription {
        betOnPerson(attr: String!): String!
    }

    input PersonInput {
        name: String!
        hairColor: HairColor!
        hairStyle: HairStyle!
        hat: Boolean!
        nose: Size!
        beard: Boolean!
        gender: Gender!
        glasses: Boolean!
        eyeColor: EyeColor!
        mouth: Size!
    }

    enum HairColor {
        BLACK
        BLOND
        BROWN
        RED
        WHITE
    }

    enum HairStyle {
        BALD
        LONG
        SHORT
    }

    enum Size {
        BIG
        SMALL
    }

    enum Gender {
        FEMALE
        MALE
        DIVERSE
    }

    enum EyeColor {
        BLUE
        BROWN
    }
`;

const resolvers = {
    Query: {
        state: () => {
            state.message = '';
            return state;
        },
        hairColor: (parent, args, ctx, info) => {
            state.turn++;

            if (args.attr === myPerson.hairColor) {
                state.message = `Yes, my person has ${args.attr.toLowerCase()} hair.`;
                eliminate('hairColor', args.attr, true);
            } else {
                state.message = `No, my person does not have ${args.attr.toLowerCase()} hair.`;
                eliminate('hairColor', args.attr, false);
            }

            checkState();
            return state;
        },
        hairStyle: (parent, args, ctx, info) => {
            state.turn++;

            if (args.attr === myPerson.hairStyle) {
                state.message = args.attr === 'BALD' ?
                    `Yes, my person is bald.` :
                    `Yes, my person has ${args.attr.toLowerCase()} hair.`
                eliminate('hairStyle', args.attr, true);
            } else {
                state.message = args.attr === 'BALD' ?
                    `No, my person is not bald.` :
                    `No, my person does not have ${args.attr.toLowerCase()} hair.`
                eliminate('hairStyle', args.attr, false);
            }

            checkState();
            return state;
        },
        hat: () => {
            state.turn++;

            if (myPerson.hat) {
                state.message = `Yes, my person wears a hat.`;
                eliminate('hat', true, true);
            } else {
                state.message = `No, my person does not wear a hat.`;
                eliminate('hat', true, false);
            }

            checkState();
            return state;
        },
        nose: (parent, args, ctx, info) => {
            state.turn++;

            if (args.attr === myPerson.nose) {
                state.message = `Yes, my person has a ${args.attr.toLowerCase()} nose.`;
                eliminate('nose', args.attr, true);
            } else {
                state.message = `No, my person does not have a ${args.attr.toLowerCase()} nose.`;
                eliminate('nose', args.attr, false);
            }

            checkState();
            return state;
        },
        beard: () => {
            state.turn++;

            if (myPerson.beard) {
                state.message = `Yes, my person has a beard.`;
                eliminate('beard', true, true);
            } else {
                state.message = `No, my person does not have a beard.`;
                eliminate('beard', true, false);
            }

            checkState();
            return state;
        },
        gender: (parent, args, ctx, info) => {
            state.turn++;

            if (args.attr === myPerson.gender) {
                state.message = `Yes, my person is ${args.attr.toLowerCase()}.`;
                eliminate('gender', args.attr, true);
            } else {
                state.message = `No, my person is not ${args.attr.toLowerCase()}.`;
                eliminate('gender', args.attr, false);
            }

            checkState();
            return state;
        },
        glasses: () => {
            state.turn++;

            if (myPerson.glasses) {
                state.message = `Yes, my person wears glasses.`;
                eliminate('glasses', true, true);
            } else {
                state.message = `No, my person does not wear glasses.`;
                eliminate('glasses', true, false);
            }

            checkState();
            return state;
        },
        eyeColor: (parent, args, ctx, info) => {
            state.turn++;

            if (args.attr === myPerson.eyeColor) {
                state.message = `Yes, my person has ${args.attr.toLowerCase()} eyes.`;
                eliminate('eyeColor', args.attr, true);
            } else {
                state.message = `No, my person does not have ${args.attr.toLowerCase()} eyes.`;
                eliminate('eyeColor', args.attr, false);
            }

            checkState();
            return state;
        },
        mouth: (parent, args, ctx, info) => {
            state.turn++;

            if (args.attr === myPerson.mouth) {
                state.message = `Yes, my person has a ${args.attr.toLowerCase()} mouth.`;
                eliminate('mouth', args.attr, true);
            } else {
                state.message = `No, my person does not have a ${args.attr.toLowerCase()} mouth.`;
                eliminate('mouth', args.attr, true);
            }

            checkState();
            return state;
        },
        name: (parent, args, ctx, info) => {
            state.turn++;
            let name = args.attr.toUpperCase();

            if (!names.includes(name)) {
                state.message = `Sorry, never heard of someone called ${name}`;
                return state;
            }

            if (name === myPerson.name.toUpperCase()) {
                eliminate('name', name, true);
            } else {
                state.message = `No, ${args.attr} is not the one you are looking for.`;
                eliminate('name', name, false);
            }

            checkState();
            return state;
        },
        restart: (parent, args, ctx, info) => {
            state.reset();
            myPerson = getRandomPerson();
            return state;
        }
    },

    Mutation: {
        addPerson: (parent, args, ctx, info) => {
            let person = {
                id: ++id,
                name: args.attr.name.toUpperCase(),
                hairColor: args.attr.hairColor,
                hairStyle: args.attr.hairStyle,
                hat: args.attr.hat,
                nose: args.attr.nose,
                beard: args.attr.beard,
                gender: args.attr.gender,
                glasses: args.attr.glasses,
                eyeColor: args.attr.eyeColor,
                mouth: args.attr.mouth
            }

            if (db.some(person => person.name.toUpperCase() === args.attr.name.toUpperCase())) {
                throw new Error(`${args.attr.name.toUpperCase()} already exists.`);
            } else {
                db.push(person);
                state.reset();
    
                return person;
            }
        },
        deletePerson: (parent, args, ctx, info) => {
            let person = db.find(person => person.name.toUpperCase() === args.attr.toUpperCase());

            if (!person) {
                throw new Error(`${args.attr.toUpperCase()} not found.`);
            } else {
                db.splice(db.indexOf(person), 1);
                return person;
            }
        }
    },

    Subscription: {
        betOnPerson: {
            subscribe: (parent, { attr }, { db, pubsub }, info) => {

                

                return pubsub.asyncIterator(`${attr.toUpperCase()}`);
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: {
        db,
        pubsub
    }
});

server.start(() => {
    console.log('Server is up! Good luck!');
})
