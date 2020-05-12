/*
 * @Author: Mr. Zhao
 * @Date: 2020-04-29 15:51:50
*/

const { Wechaty,Message } = require("wechaty") // Wechaty核心包
const { PuppetPadplus } = require("wechaty-puppet-padplus") // padplus协议包
const Qrterminal = require("qrcode-terminal")

const config = require("./config") // 配置文件


const BotMessage = require("./BotMessage") // 消息监听回调
const BotFriendShip = require("./BotFriendShip") // 好友添加监听回调
  // 初始化
const bot = new Wechaty({
    puppet: new PuppetPadplus({
      token: config.token
    }),
    name: config.name
  })
bot
  .on('scan',function(qrcode, status) { //机器人二维码
    Qrterminal.generate(qrcode, { small: true })
  })
  .on('login',function(user){ //上线
      console.log(`${user.name()} login`)
  })
  .on('logout',function(user){ //掉线
      console.log(`${user} logout`)
  })
  .on("room-join", // 进入房间监听回调 room-群聊 inviteeList-受邀者名单 inviter-邀请者
     function onRoomJoin(room, inviteeList, inviter) {
      // 判断配置项群组id数组中是否存在该群聊id
      if (Object.values(config.room.roomList).some(v => v == room.id)) {
        // let roomTopic = await room.topic()
        inviteeList.map(c => {
          // 发送消息并@
          room.say(config.room.roomJoinReply, c)
        })
      }
    }) // 加入房间监听
  .on('message',BotMessage(bot)) //消息
  .on('friendship',BotFriendShip) //监听好友添加
  .start()