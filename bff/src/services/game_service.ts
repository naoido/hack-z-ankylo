import { PubSub } from "graphql-subscriptions";
import { v4 as uuidv4 } from 'uuid';
import { User } from "../generated/graphql.js";


const pubSub = new PubSub();
const MATCHING_FOUND = "MATCHING_FOUND";

const waitingUsers: User[] = [];

export const addUserMatchingpool = (user: User) => waitingUsers.push(user);

export const createMatch = (userId: string) => {
    const userIndex = waitingUsers.findIndex(user => user.user_id === userId);
    if (userIndex === -1 || waitingUsers.length < 2) {
        return null;
    }
    const user1 = waitingUsers.splice(userIndex, 1)[0];
    const user2 = waitingUsers.shift();
    const roomId = uuidv4();
    publish(MATCHING_FOUND, { matching: roomId });

    return roomId;
}

export const publish = (trriger: string, payload : any) => pubSub.publish(trriger, payload);
export const getMatchingUsers = () => waitingUsers;
export const found = () => pubSub.asyncIterator<string>([MATCHING_FOUND]);
export const select = (roomId: string) => pubSub.asyncIterator([`GAME_${roomId}`])