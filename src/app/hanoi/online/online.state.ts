export enum GameState {
  INITIAL = 'initial',    // 初始状态
  WAITING = 'waiting',    // 主方已创建房间，等待对方加入
  READY = 'ready',        // 对方已加入，准备开始
  PLAYING = 'playing',    // 双方正在游戏中
  FINISHED = 'finished'   // 有一方已完成游戏，已决出胜利者
}
