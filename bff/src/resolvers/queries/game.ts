import { getMatchingUsers } from "../../services/game_service.js";

const HelloSquare = () => {
    return 'Hello Square!';
};

const waitingUsers = () => {
    return getMatchingUsers();
};

export default { HelloSquare, waitingUsers };