import { gql } from "@apollo/client";

export const matching = gql`
  subscription Subscription {
    matching
  }
`;

export const findMatching = gql`
  mutation FindMatch($userId: ID) {
    findMatch(user_id: $userId)
  }
`;

export const addUser = gql`
  mutation AddUser($userId: ID, $name: String) {
    addUser(user_id: $userId, name: $name) {
      name
      user_id
    }
  }
`;