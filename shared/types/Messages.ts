export type ClientMessage = {
  type: "message",
  payload: {
    text: string,
  }
}

export type Message = {
  type: "message",
  sender: string,
  payload: {
    text: string,
  }
}