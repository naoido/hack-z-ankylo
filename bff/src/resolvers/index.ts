import Mutation from './mutations/index.js';
import Query from './queries/index.js';
import Subscription from './subscriptions/index.js';

const resolvers = {
    Query,
    Mutation,
    Subscription,
};

export default resolvers;