import { found, select } from "../../services/game_service.js";

const gameSubscriptionResolver = {
    matching: {
        subscribe: () => found(),
    },
    selectNum: {
        subscribe: (_, { roomId }) => select(roomId),
    },
};

export default gameSubscriptionResolver