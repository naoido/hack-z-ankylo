import { PubSub } from "graphql-subscriptions";
import { v4 as uuidv4 } from 'uuid';
import {QrCode, User} from "../generated/graphql.js";
import axios from "axios";

type MatchData = {
    numbers: number[];
}

const pubSub = new PubSub();
const MATCHING_FOUND = "MATCHING_FOUND";

const waitingUsers: User[] = [];

export const addUserMatchingpool = (user: User) => waitingUsers.push(user);

export const createMatch = async (userId: string) => {
    const response = await axios.get<MatchData>("http://localhost:4000/create")
    const userIndex = waitingUsers.findIndex(user => user.user_id === userId);
    if (userIndex === -1 || waitingUsers.length < 2) {
        return null;
    }
    const user1 = waitingUsers.splice(userIndex, 1)[0];
    const user2 = waitingUsers.shift();
    const roomId =  uuidv4();
    const matchData = {
        roomId: roomId,
        users: [
            { user_id: user1.user_id, name: user1.name, offer: true, room_id: user1.room_id, result: response.data.numbers },
            { user_id: user2.user_id, name: user2.name, offer: false, room_id: user2.room_id, result: response.data.numbers }
        ]
    };
    publish(MATCHING_FOUND, { matching: matchData });

    return roomId;
}

export const publish = (trriger: string, payload : any) => pubSub.publish(trriger, payload);
export const getMatchingUsers = () => waitingUsers;
export const found = () => pubSub.asyncIterator<string>([MATCHING_FOUND]);
export const select = (roomId: string) => pubSub.asyncIterator([`GAME_${roomId}`])