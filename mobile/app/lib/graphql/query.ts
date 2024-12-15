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

export const registQRcode = gql`
mutation Mutation($content: String!, $qrcode_name: String!) {
  generateQrCode(content: $content, qrcode_name: $qrcode_name) {
    error
    qrcode_id
    qrcode_url
  }
}
`;

export const generateAnimateQrCode = gql`
mutation Mutation($image: String!, $content: String!, $qrcode_name: String!) {
  generateAnimateQrCode(image: $image, content: $content, qrcode_name: $qrcode_name) {
    qrcode_id
    qrcode_url
    qrcode_content
    qrcode_name
    user_id
    error
  }
}

`

export const getQRcodes = gql`
mutation Mutation($page: Int!, $count: Int!, $userId: String!) {
  getQrCodes(page: $page, count: $count, user_id: $userId) {
    error
    qrcodes {
      qrcode_id
      qrcode_url
      qrcode_content
      qrcode_name
      user_id
      error
    }
  }
}
`;