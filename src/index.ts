import { ApolloServer, gql, PubSub } from 'apollo-server';
import { BookController } from './controller/BookController';
import { v4 as uuidv4 } from 'uuid';

const pubsub = new PubSub();
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Message {
    messageId: ID
    message: String
  }

  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(title:String, author:String) : Book
    addMessage(message:String) : Message
  }

  type Subscription {
    books: [Book]
    newMessage: Message
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
    async addMessage(_: any, args: { message: string }, __: any) {
      const messageId = uuidv4()
      pubsub.publish("MESSAGE_ADDED", { newMessage: { messageId, message: args.message } });
      return args
    }
  },
  Subscription: {
    books: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"])
    },
    newMessage: {
      subscribe: (parent, args, context, info) => {
        return pubsub.asyncIterator("MESSAGE_ADDED")
      }
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});