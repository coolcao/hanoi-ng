export interface RoomInfo {
  roomName: string;
  size: number;
}
// 游戏数据
export interface PlayData {
  stack1: number[];
  stack2: number[];
  stack3: number[];
  steps: number;
}
export interface Message<T> {
  type: 'room-info' | 'play-data';
  data: T;
}
