let currentId = 0;
let messageId = 0;

export default defineNuxtPlugin(() => {
  return {
    provide: {
      uniqueId: () => 'id-' + currentId++,
      uniqueMsgId: () => 'message-' + messageId++,
    }
  }
});
