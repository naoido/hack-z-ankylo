import { GraphQLUpload } from 'graphql-upload-ts';
import Mutation from './mutations/index.js';
import Query from './queries/index.js';
import Subscription from './subscriptions/index.js';

const resolvers = {
    Upload: GraphQLUpload,
    Query,
    Mutation,
    Subscription,
};

export default resolvers;