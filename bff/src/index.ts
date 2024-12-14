import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { Context } from './constants/context.js';
import resolvers from './resolvers/index.js';

const PORT = 3000;
const PATH = "/graphql"

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
    server: httpServer,
    path: PATH
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const typeDefs = loadSchemaSync(join(__dirname, '../schema.graphql'), {
    loaders: [new GraphQLFileLoader()],
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const wsServerCleanUp = useServer({ schema }, wsServer);

const apolloServer = new ApolloServer<Context>({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await wsServerCleanUp.dispose();
                    }
                }
            }
        }
    ]
});

app.use(graphqlUploadExpress({ maxFileSize: 50 * 1024 * 1024, maxFiles: 1 }));

await apolloServer.start();

app.use(cors());
app.use(PATH, bodyParser.json(), expressMiddleware(apolloServer, {
    context: async ({ req }) => {
        return { headers: req.headers };
    },
}));

httpServer.listen(PORT, () => {
    console.log(`🚀 Apollo Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`);
});
