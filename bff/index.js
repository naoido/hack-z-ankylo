import { ApolloServer } from '@apollo/server';
import { createServer } from 'http';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bodyParser from 'body-parser';
import express from 'express';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { v4 as uuidv4 } from 'uuid';
import { PubSub } from 'graphql-subscriptions';
import cors from 'cors';

const port = 3000;

const typeDefs = `
    type User {
        user_id: ID
        name: String
    }

    type Match {
        user1: User
        user2: User
    }

    type Query {
        HelloSquare: String!
        waitingUsers: [User]
    }

    type Mutation {
        addUser(user_id: ID, name: String): User
        findMatch(user_id: ID): String
        selectCard(roomId: ID!, num: Int): Int
    }

    type Subscription {
        matching: String
        selectNum(roomId: ID!): Int!
    }
`;

const pubSub = new PubSub();
const waitingUsers = [];
const MATCHING_FOUND = 'MATCHING_FOUND';

const resolvers = {
    Mutation: {
        addUser(_, { user_id, name }) {
            const user = { user_id, name };
            waitingUsers.push(user);
            return user;
        },
        findMatch(_, { user_id }) {
            const userIndex = waitingUsers.findIndex(user => user.user_id === user_id);
            if (userIndex === -1 || waitingUsers.length < 2) {
                return null;
            }
            const user1 = waitingUsers.splice(userIndex, 1)[0];
            const user2 = waitingUsers.shift();
            const roomId = uuidv4();
            pubSub.publish(MATCHING_FOUND, { matching: roomId });
            return roomId;
        },
        selectCard: (_, { roomId, num }) => {
            pubSub.publish(`GAME_${roomId}`, { selectNum: num });
            return num;
        }
    },
    Query: {
        HelloSquare() {
            return 'Hello Square!';
        },
        waitingUsers() {
            return waitingUsers;
        }
    },
    Subscription: {
        matching: {
            subscribe: () => pubSub.asyncIterator([MATCHING_FOUND])
        },
        selectNum: {
            subscribe: (_, { roomId }) => pubSub.asyncIterator([`GAME_${roomId}`])
        }
    }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
});

const wsServerCleanup = useServer({ schema }, wsServer);

const apolloServer = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await wsServerCleanup.dispose();
                    }
                };
            }
        }
    ]
});

await apolloServer.start();

app.use(cors());
app.use('/graphql', bodyParser.json(), expressMiddleware(apolloServer));

httpServer.listen(port, () => {
    console.log(`🚀 Apollo Server ready at http://localhost:${port}/graphql`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${port}/graphql`);
});
