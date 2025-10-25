export function createMessage({
  id,
  senderId,
  channelId,
  text,
  timestamp = new Date().toISOString(),
  recipientId = null,
}) {
  return { id, senderId, channelId, text, timestamp, recipientId }
}
