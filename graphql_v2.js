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
`;

const resolvers = {
    Query: {
        state: () => state,
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

            return state;
        },
        hat: () => {
            return db.filter(person => person.hat);
        },
        nose: (parent, args, ctx, info) => {
            return db.filter(person => person.nose === args.attr);
        },
        beard: () => {
            return db.filter(person => person.beard);
        },
        gender: (parent, args, ctx, info) => {
            return db.filter(person => person.gender === args.attr);
        },
        glasses: () => {
            return db.filter(person => person.glasses);
        },
        eyeColor: (parent, args, ctx, info) => {
            return db.filter(person => person.eyeColor === args.attr);
        },
        mouth: (parent, args, ctx, info) => {
            return db.filter(person => person.mouth === args.attr);
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
