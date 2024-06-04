import User from "../models/User";

export function find() {
    return User.findAll();
}
