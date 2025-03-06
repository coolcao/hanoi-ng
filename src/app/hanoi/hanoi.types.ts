export interface StackList {
  stack1: number[];
  stack2: number[];
  stack3: number[];
}

export interface RoomInfo {
  size: number;
}


export enum PeerEventType {
  ROOM_INFO = 'room-info',
  READY = 'ready',
  MOVE = 'move',
}
export interface PeerDataEvent<T> {
  event: PeerEventType;
  data: T
}


export type StackKey = 'stack1' | 'stack2' | 'stack3';
export interface MoveOperation {
  stacks: StackList; // 使用元组类型限制为三个子数组
  from: StackKey;   // 移动的来源堆栈
  to: StackKey;   // 移动的目标堆栈
  disc: number; // 移动的碟片
}
export interface MoveEventData {
  from: StackKey;   // 移动的来源堆栈
  to: StackKey;   // 移动的目标堆栈
  disc: number; // 移动的碟片
}

export enum PlayerState {
  INITIAL = 'initial',
  READY = 'ready',
  PLAYING = 'playing',
  FINISHED = 'finished',
  WIN = 'win',
  LOSE = 'lose',
}

export enum GameState {
  INITIAL = 'initial',  // 初始状态
  WAITING = 'waiting',  // 等待对方准备
  PEER_CONNECTED = 'peer-connected', // 对方已连接
  READY = 'ready',       // 双方都已准备好
  STARTED = 'started',  // 游戏开始
  FINISHED = 'finished', // 游戏结束
}
