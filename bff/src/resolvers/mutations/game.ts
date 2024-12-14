import { MutationResolvers, User } from '../../generated/graphql.js';
import { addUserMatchingpool, createMatch, publish } from '../../services/game_service.js';

const addUser: MutationResolvers["addUser"] = (_, { user_id, name, room_id }) => {
    const user: User = {
        __typename: "User",
        user_id, name, room_id
    };
    addUserMatchingpool(user);
    return user;
}

const findMatch: MutationResolvers["findMatch"] = (_, { user_id }) => {
    return createMatch(user_id);
}

const selectCard: MutationResolvers["selectCard"] = (_, { num, roomId }) => {
    publish(`GAME_${roomId}`, { selectNum: num });
    return num ?? -1;
}

export default { addUser, findMatch, selectCard }