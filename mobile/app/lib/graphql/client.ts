import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { EXPO_PUBLIC_GRAPHQL_URL, EXPO_PUBLIC_GRAPHQL_WS_URL } from "@env";

const httpLink = new HttpLink({
    uri: EXPO_PUBLIC_GRAPHQL_URL,
});

const wsLink = new GraphQLWsLink(createClient({
    url: EXPO_PUBLIC_GRAPHQL_WS_URL,
}));

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});