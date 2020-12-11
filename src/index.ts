import { ApolloServer, gql, PubSub } from 'apollo-server';
import { BookController } from './BookController';

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


const resolvers = {
  Query: {
    books: () => BookController.listBooks()
  },
  Mutation: {
    async addBook(_: any, args: { title: string, author: string }, __: any) {
      await BookController.addBook(args)
      pubsub.publish("BOOK_ADDED", { books: BookController.listBooks() });
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