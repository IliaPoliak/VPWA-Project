export function createUser({
    id,
    firstName,
    lastName,
    nickName,
    email,
    password,
    color,
    channels = [],
    messages = []
}) {
    return { id, firstName, lastName, nickName, email, password, color, channels, messages};
}