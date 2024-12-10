import { gql } from "@apollo/client";

export const matching = gql`
    subscription Matching {
        matching {
            roomId
            users {
                offer
                name
                user_id
                room_id
            }
        }
    }
`;

export const findMatching = gql`
  mutation FindMatch($userId: ID) {
    findMatch(user_id: $userId)
  }
`;

export const addUser = gql`
  mutation AddUser($userId: ID, $name: String, $room_id: String) {
    addUser(user_id: $userId, name: $name, room_id: $room_id) {
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