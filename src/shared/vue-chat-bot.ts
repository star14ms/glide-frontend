
type MessageData = {
  agent: string,
  type: string,
  text: string,
  disableInput: boolean,
  reselectable?: boolean,
  botTyping?: boolean,
  options?: {
    text: string,
    value: any,
    action: string,
    emit?: string,
    type?: string,
    to?: string,
  }[],
  options_multiple_choice?: {
    text: string,
    value: string,
  }[]
}

type Scenario = MessageData[][]


export { MessageData, Scenario }