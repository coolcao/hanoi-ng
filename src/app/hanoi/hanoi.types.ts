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
export type StackKey = 'stack1' | 'stack2' | 'stack3';
export interface MoveEventData {
  stacks: StackList; // 使用元组类型限制为三个子数组
  from: StackKey;   // 移动的来源堆栈
  to: StackKey;   // 移动的目标堆栈
  disc: number; // 移动的碟片
}

export enum GameState {
  INITIAL = 'initial',    // 初始状态
  WAITING = 'waiting',    // 主方已创建房间，等待对方加入
  READY = 'ready',        // 对方已加入，准备开始
  PLAYING = 'playing',    // 双方正在游戏中
  FINISHED = 'finished',   // 有一方已完成游戏，已决出胜利者
  ERROR = 'error'
}
