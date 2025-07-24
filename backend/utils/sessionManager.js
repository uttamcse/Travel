const { v4: uuidv4 } = require('uuid');

// Enum-like structures
const MessageType = {
  STATE: 'STATE',
  OFFER: 'OFFER',
  ANSWER: 'ANSWER',
  ICE: 'ICE',
};

const WebRTCSessionState = {
  ACTIVE: 'Active',       // Offer and Answer messages have been sent
  CREATING: 'Creating',   // Creating session, offer has been sent
  READY: 'Ready',         // Both clients available and ready to initiate session
  IMPOSSIBLE: 'Impossible', // Less than two clients
};

// State and client map
const clients = new Map(); // Map<UUID, WebSocket>
let sessionState = WebRTCSessionState.IMPOSSIBLE;

function onSessionStarted(sessionId, ws) {
  if (clients.size >= 2) {
    ws.close();
    return;
  }

  clients.set(sessionId, ws);
  send(ws, `Added as a client: ${sessionId}`);

  if (clients.size === 2) {
    sessionState = WebRTCSessionState.READY;
  }

  notifyAboutStateUpdate();
}

function onMessage(sessionId, message) {
  if (message.startsWith(MessageType.STATE)) {
    handleState(sessionId);
  } else if (message.startsWith(MessageType.OFFER)) {
    handleOffer(sessionId, message);
  } else if (message.startsWith(MessageType.ANSWER)) {
    handleAnswer(sessionId, message);
  } else if (message.startsWith(MessageType.ICE)) {
    handleIce(sessionId, message);
  }
}

function handleState(sessionId) {
  const ws = clients.get(sessionId);
  if (ws) {
    send(ws, `${MessageType.STATE} ${sessionState}`);
  }
}

function handleOffer(sessionId, message) {
  if (sessionState !== WebRTCSessionState.READY) {
    console.error('Cannot handle offer. Session is not in READY state.');
    return;
  }

  sessionState = WebRTCSessionState.CREATING;
  console.log(`Handling offer from ${sessionId}`);
  notifyAboutStateUpdate();

  const recipient = getOtherClient(sessionId);
  if (recipient) {
    send(recipient, message);
  }
}

function handleAnswer(sessionId, message) {
  if (sessionState !== WebRTCSessionState.CREATING) {
    console.error('Cannot handle answer. Session is not in CREATING state.');
    return;
  }

  console.log(`Handling answer from ${sessionId}`);
  const recipient = getOtherClient(sessionId);
  if (recipient) {
    send(recipient, message);
  }

  sessionState = WebRTCSessionState.ACTIVE;
  notifyAboutStateUpdate();
}

function handleIce(sessionId, message) {
  console.log(`Handling ICE candidate from ${sessionId}`);
  const recipient = getOtherClient(sessionId);
  if (recipient) {
    send(recipient, message);
  }
}

function onSessionClose(sessionId) {
  clients.delete(sessionId);
  sessionState = WebRTCSessionState.IMPOSSIBLE;
  notifyAboutStateUpdate();
}

function notifyAboutStateUpdate() {
  for (const ws of clients.values()) {
    send(ws, `${MessageType.STATE} ${sessionState}`);
  }
}

function send(ws, message) {
  try {
    ws.send(message);
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

function getOtherClient(currentSessionId) {
  for (const [id, ws] of clients.entries()) {
    if (id !== currentSessionId) {
      return ws;
    }
  }
  return null;
}

module.exports = {
  onSessionStarted,
  onMessage,
  onSessionClose,
};
