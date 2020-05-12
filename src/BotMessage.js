/*
 * @Author: Mr. Zhao
 * @Date: 2020-04-29 15:51:50
 * @Description: 消息监听回调
 */


const { Message } = require("wechaty")
const config = require("./config") // 配置文件
const schedule = require('node-schedule'); //定时器


const name = config.name // 机器人名字
const roomList = config.room.roomList // 管理群组列表


module.exports = bot => {
    // schedule.scheduleJob('1 * * * * *',()=>{
    //     roomList.map(async (item)=>{
    //         console.log(item)
    //         const room = await bot.Room.find({item})
    //         console.log(new Date(),room)
    //     })
    // })

    
    return async function BotMessage(msg) {
        console.log(msg)

        const content = msg.text() //内容
        const contact = msg.from() //发言人
        const room = msg.room()  //是不是群里发的

        console.log(`说话人：${contact}`)
        console.log(`内容：${content}`)
        
        if(msg.self()) return //防止自己对话

        if(msg.type() === Message.Type.Text){ //判断是不是文本消息
            //判断是不是群里发的
            if(room){ 
                console.log(`群id: ${room.id}`);
                console.log(`内容：${await msg.to()}`)

                let self = await msg.to()
                self = "@" + self.name()
                console.log(self+'.111111111111111111111111')
                // 获取消息内容，拿到整个消息文本，去掉 @+名字 
                let sendText = msg.text().replace(self,"").replace(/\s+/g,"")
             
                console.log(`内容：${sendText}`)
                 //机器人是否被@
                if(await msg.mentionSelf()){
                    let flag 
                    if(sendText == "你好" || sendText == "嗨" || sendText == "嘿"){
                        flag =`${sendText},请问有什么事` 
                    }else{
                        flag = `@${contact.name()}你艾特我也没用,我在还在学习中,只会一些简单的问答,暂时没法回答你的问题`
                    }
                    await msg.say(flag)
                    return
                }
                //群名
                console.log(`Message in Romm: Content: ${content},Room: ${ await room.topic()}`)
            }else{
                let flagText = content.replace(/\s+/g,"") //去除空格
                console.log(`Message in isRomm: Content: ${content}`)
                if(flagText == "你好" || flagText == "嗨" || flagText == "嘿"){ //关键字回复
                    let flag = `${flagText},亲爱的女士（先生）请问有能帮助你的\n\n加群：请发送 加群`
                    await msg.say(flag)
                    return
                }else{
                    // 回复信息是关键字 “加群”
                    if (await isAddRoom(flagText)) return
                    // 回复信息是所管理的群聊名
                    if (await isRoomName(bot, msg)) return
                }
            }
        }else { return console.log("消息不是文本！") } 
  }

}

/**
 * @description 回复信息是关键字 “加群” 处理函数
 * @param {Object} content  内容
 * @return {Promise} true-是 false-不是
 */
async function isAddRoom(content) {
    // 关键字 加群 处理
    if (content == "加群") {
      let roomListName = Object.keys(roomList)
       console.log(roomListName)
      let info = `${name}当前管理群聊有${roomListName.length}个，回复群聊名即可加入哦\n\n`
      roomListName.map(v => {
        info += "【" + v + "】" + "\n"
      })
      await msg.say(info)
      return true
    }
    return false
}
  
/**
 * @description 回复信息是所管理的群聊名 处理函数
 * @param {Object} bot 实例对象
 * @param {Object} msg 消息对象
 * @return {Promise} true-是群聊 false-不是群聊
 */
async function isRoomName(bot, msg) {
    // 回复信息为管理的群聊名
    if (Object.keys(roomList).some(v => v == msg.text())) {
        // 通过群聊id获取到该群聊实例
        const room = await bot.Room.find({ id: roomList[msg.text()] })

        // 判断是否在房间中 在-提示并结束
        if (await room.has(msg.from())) {
            await msg.say("您已经在房间中了")
            return true
        }

        // 发送群邀请
        await room.add(msg.from())
        await msg.say("已发送群邀请")
        return true
    }
    return false
}
