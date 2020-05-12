/*
 * @Author: Mr. Zhao
 * @Date: 2020-04-29 15:51:50
*/
module.exports = {
  // puppet_padplus Token
  token: 'token',
  // 机器人名字
  name: '静音',
  // 房间/群聊
  room: {
    // 管理群组列表
  roomList:{
    // 群id
  },
    // 加入房间回复
    roomJoinReply: `\n 你好，欢迎你的加入`,
  },
  // 私人
  personal: {
    // 好友验证自动通过关键字
    addFriendKeywords: ['加群','你好'],
    // 是否开启加群
    addRoom: true,
  },
};
