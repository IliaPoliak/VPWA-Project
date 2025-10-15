export function createChannel({
    id,
    ownerId,
    name,
    type,
    color,
    members = [],
    messages = []
}) {
    return {id, ownerId, name, type, color, members, messages}
}