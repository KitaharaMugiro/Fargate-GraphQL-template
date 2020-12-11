import { ApolloServer, gql, PubSub } from 'apollo-server';

const pubsub = new PubSub();
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(title:String, author:String) : Book
  }

  type Subscription {
    books: [Book]
  }
`;

const books = [
  {
    title: 'タイトル',
    author: '著者',
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    addBook(_: any, args: { title: string, author: string }, __: any) {
      books.push(args)
      pubsub.publish("BOOK_ADDED", { books: books });
      return args
    },
  },
  Subscription: {
    books: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"])
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});