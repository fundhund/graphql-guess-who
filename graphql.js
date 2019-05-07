const { GraphQLServer } = require('graphql-yoga');
const db = require('./db');

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

    type Query {
        allPersons: [Person!]!
        hairColor(attr: HairColor!): [Person!]!
        hairStyle(attr: HairStyle!): [Person!]!
        hat: [Person!]!
        nose(attr: Size!): [Person!]!
        beard: [Person!]!
        gender(attr: Gender!): [Person!]!
        glasses: [Person!]!
        eyeColor(attr: EyeColor!): [Person!]!
        mouth(attr: Size!): [Person!]!
    }

    enum HairColor {
        BLACK
        BLOND
        BROWN
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
        allPersons: () => db,
        hairColor: (parent, args, ctx, info) => {
            return db.filter(person => person.hairColor === args.attr);
        },
        hairStyle: (parent, args, ctx, info) => {
            return db.filter(person => person.hairStyle === args.attr);
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
