const graphql = require('graphql');
const R = require('ramda');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
} = graphql;

const books = [
    { id: '1', name: 'ex1', genre: 'fiction', authorId: '3' },
    { id: '2', name: 'ex2', genre: 'fiction', authorId: '2' },
    { id: '3', name: 'ex3', genre: 'fiction', authorId: '1' },
    { id: '4', name: 'ex4', genre: 'fiction', authorId: '3' },
    { id: '5', name: 'ex5', genre: 'fiction', authorId: '2' },
    { id: '6', name: 'ex6', genre: 'fiction', authorId: '3' },
];

const authors = [
    { id: '1', name: 'n1', age: 12 },
    { id: '2', name: 'n2', age: 16 },
    { id: '3', name: 'n3', age: 19 },
];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve({ authorId }, args) {
                return R.find(R.propEq('id', authorId), authors);
            },
        },
    }),
});

const AuthorType = new GraphQLObjectType({
    name: 'Authors',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve({ id }, args) {
                return R.filter(R.propEq('authorId', id), books);
            },
        },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                // TODO: code to get data from db / other source
                return R.find(R.propEq('id', id), books);
            },
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return R.find(R.propEq('id', id), authors);
            },
        },
        books: {
            type: new GraphQLList(BookType),
            resolve() {
                return books;
            },
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve() {
                return authors;
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});
