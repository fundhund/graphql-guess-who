const { GraphQLServer } = require('graphql-yoga');
const db = require('./db');

let personsLeft = db;
let turn = 0;
let message = '';

let state = {
    personsLeft,
    turn,
    message
};

// Choose random person
const randomNumber = Math.floor(Math.random() * (db.length + 1)); 
let myPerson = db[randomNumber];

function checkState() {
    if (state.personsLeft.length === 1) {
        state.message =
            `Congratulations! You found out that I thought of ${myPerson.name.toUpperCase()} in ${state.turn} turns!`
    }
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
        name(attr: Name!): State!
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
    }

    enum EyeColor {
        BLUE
        BROWN
    }

    enum Name {
        ALEX
        ALFRED
        ANITA
        ANNE
        BERNARD
        BILL
        CHARLES
        CLAIRE
        DAVID
        ERIC
        FRANS
        GEORGE
        HERMAN
        JOE
        MARIA
        MAX
        PAUL
        PETER
        PHILIP
        RICHARD
        ROBERT
        SAM
        SUSAN
        TOM
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
                state.personsLeft = state.personsLeft
                    .filter(person => person.hairColor === args.attr);
            } else {
                state.message = `No, my person does not have ${args.attr.toLowerCase()} hair.`;
                state.personsLeft = state.personsLeft
                    .filter(person => person.hairColor !== args.attr);
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
                state.personsLeft = state.personsLeft
                    .filter(person => person.hairStyle === args.attr);
            } else {
                state.message = args.attr === 'BALD' ?
                    `No, my person is not bald.` :
                    `No, my person does not have ${args.attr.toLowerCase()} hair.`
                state.personsLeft = state.personsLeft
                    .filter(person => person.hairStyle !== args.attr);
            }

            checkState();
            return state;
        },
        hat: () => {
            state.turn++;

            if (myPerson.hat) {
                state.message = `Yes, my person wears a hat.`;
                state.personsLeft = state.personsLeft
                    .filter(person => person.hat);
            } else {
                state.message = `No, my person does not wear a hat.`;
                state.personsLeft = state.personsLeft
                    .filter(person => !person.hat);
            }

            checkState();
            return state;
        },
        nose: (parent, args, ctx, info) => {
            state.turn++;

            if (args.attr === myPerson.nose) {
                state.message = `Yes, my person has a ${args.attr.toLowerCase()} nose.`;
                state.personsLeft = state.personsLeft
                    .filter(person => person.nose === args.attr);
            } else {
                state.message = `No, my person does not have a ${args.attr.toLowerCase()} nose.`;
                state.personsLeft = state.personsLeft
                    .filter(person => person.nose !== args.attr);
            }

            checkState();
            return state;
        },
        beard: () => {
            state.turn++;

            if (myPerson.beard) {
                state.message = `Yes, my person has a beard.`;
                state.personsLeft = state.personsLeft
                    .filter(person => person.beard);
            } else {
                state.message = `No, my person does not have a beard.`;
                state.personsLeft = state.personsLeft
                    .filter(person => !person.beard);
            }

            checkState();
            return state;
        },
        gender: (parent, args, ctx, info) => {
            state.turn++;

            if (args.attr === myPerson.gender) {
                state.message = `Yes, my person is ${args.attr.toLowerCase()}.`;
                state.personsLeft = state.personsLeft
                    .filter(person => person.gender === args.attr);
            } else {
                state.message = `No, my person is not ${args.attr.toLowerCase()}.`;
                state.personsLeft = state.personsLeft
                    .filter(person => person.gender !== args.attr);
            }

            checkState();
            return state;
        },
        glasses: () => {
            state.turn++;

            if (myPerson.glasses) {
                state.message = `Yes, my person wears glasses.`;
                state.personsLeft = state.personsLeft
                    .filter(person => person.glasses);
            } else {
                state.message = `No, my person does not wear glasses.`;
                state.personsLeft = state.personsLeft
                    .filter(person => !person.glasses);
            }

            checkState();
            return state;
        },
        eyeColor: (parent, args, ctx, info) => {
            state.turn++;

            if (args.attr === myPerson.eyeColor) {
                state.message = `Yes, my person has ${args.attr.toLowerCase()} eyes.`;
                state.personsLeft = state.personsLeft
                    .filter(person => person.eyeColor === args.attr);
            } else {
                state.message = `No, my person does not have ${args.attr.toLowerCase()} eyes.`;
                state.personsLeft = state.personsLeft
                    .filter(person => person.eyeColor !== args.attr);
            }

            checkState();
            return state;
        },
        mouth: (parent, args, ctx, info) => {
            state.turn++;

            if (args.attr === myPerson.mouth) {
                state.message = `Yes, my person has a ${args.attr.toLowerCase()} mouth.`;
                state.personsLeft = state.personsLeft
                    .filter(person => person.mouth === args.attr);
            } else {
                state.message = `No, my person does not have a ${args.attr.toLowerCase()} mouth.`;
                state.personsLeft = state.personsLeft
                    .filter(person => person.mouth !== args.attr);
            }

            checkState();
            return state;
        },
        name: (parent, args, ctx, info) => {
            state.turn++;

            if (args.attr === myPerson.name.toUpperCase()) {
                state.personsLeft = [myPerson];
            } else {
                state.message = `No, ${args.attr} is not the one you are looking for.`;
                state.personsLeft = state.personsLeft
                    .filter(person => person.name.toUpperCase() !== args.attr);
            }

            checkState();
            return state;
        },
    }
}


const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('Server is up!');
})
