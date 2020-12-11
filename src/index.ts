import { ApolloServer, gql, PubSub } from 'apollo-server';
import { BookController } from './BookController';

const pubsub = new PubSub();
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Message {
    message: String
  }

  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(title:String, author:String) : Book
    addMessage(roomId:ID!, message:String) : Message
  }

  type Subscription {
    books: [Book]
    messages(roomId: ID!) : [Message]
  }
`;

const rooms = [
  { roomId: "0", messages: [] },
  { roomId: "1", messages: [] },
]

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
    async addMessage(_: any, args: { roomId: string, message: string }, __: any) {
      const room = rooms.find(r => r.roomId === args.roomId)
      room.messages.push({ message: args.message })
      pubsub.publish("MESSAGE_ADDED" + args.roomId, { messages: room.messages });
      return args
    }
  },
  Subscription: {
    books: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"])
    },
    messages: {
      subscribe: (parent, args, context, info) => {
        console.log(args)
        return pubsub.asyncIterator("MESSAGE_ADDED" + args.roomId)
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