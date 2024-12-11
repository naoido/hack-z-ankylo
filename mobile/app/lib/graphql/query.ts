import { gql } from "@apollo/client";

export const matching = gql`
    subscription Subscription {
      matching {
        roomId
        users {
          name
          offer
          room_id
          user_id
        }
      }
    }
`;

export const findMatching = gql`
mutation Mutation($userId: ID) {
  findMatch(user_id: $userId)
}
`;

export const addUser = gql`
 mutation Mutation($userId: ID, $name: String, $roomId: ID) {
  addUser(user_id: $userId, name: $name, room_id: $roomId) {
    name
    user_id
  }
}
`;

export const shareRoom = gql`
    subscription Subscription($roomId: ID!) {
      shareRoom(roomId: $roomId)
    }
`;

export const shareRoomId = gql`
  mutation Mutation($roomId: ID!, $firebaseId: ID!) {
      shareRoomID(roomId: $roomId, firebaseId: $firebaseId)
    }
`;