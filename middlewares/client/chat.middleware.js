const RoomChat = require("../../models/rooms-chat.model")
module.exports.isAccess = async(req, res, next)=>{
    const userId = res.locals.user.id
    const roomChatId = req.params.roomChatId

    try {
        isAccessRoomChat = await RoomChat.findOne({
            _id: roomChatId,
            "users.user_id": userId,
            deleted: false
        })

        if(isAccessRoomChat){
            next()
        }else{
            res.redirect("/")
        }        
    } catch (error) {
        res.redirect("/")
    }
}