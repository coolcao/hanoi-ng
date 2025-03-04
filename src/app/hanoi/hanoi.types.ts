export interface StackList {
  stack1: number[];
  stack2: number[];
  stack3: number[];
}

export interface RoomInfo {
  roomName: string;
  size: number;
}

// 游戏数据
export interface PlayData {
  stacks: StackList;
  steps: number;
}
export interface Message<T> {
  type: 'room-info' | 'start-game' | 'play-data';
  data: T;
}

export interface MoveOperation {
  fromStack: number[];
  toStack: number[];
  disc: number;
  fromId: string;
  toId: string;
}
