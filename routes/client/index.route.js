const productRoutes = require("./product.route.js")
const homeRoutes = require("./home.route.js")
const categoryMiddleware = require("../../middlewares/client/category.middleware.js")
const searchRoutes = require("./search.route.js")
const cartMiddleware = require("../../middlewares/client/cart.middleware.js")
const cartRoute = require("./cart.route.js")
const checkoutRoute = require("./checkout.route.js")
const userMiddleware = require("../../middlewares/client/user.middleware.js")
const settingMiddleware = require("../../middlewares/client/setting.middleware.js")
const chatRoute = require("./chat.route.js")
const authMiddleware = require("../../middlewares/client/auth.middleware.js")

const usersRoute = require("./users.route.js") //route này dung để quản lý chức năng chat
const userRoute = require("./user.route.js") //Route này dùng để quản lý người dùng trang web bên client
const RoomChatRoute = require("./rooms-chat.route.js")
//Tách riêng các thằng routes này ra để dễ quản lý
module.exports = (app)=>{ //Lệnh này là exports trong express
    app.use(categoryMiddleware.category)

    app.use(cartMiddleware.cartId)

    app.use(userMiddleware.infoUser)

    app.use(settingMiddleware.settingGeneral)

    app.use('/', homeRoutes)

    app.use("/cart", cartRoute)

    app.use("/checkout", checkoutRoute)
    
    app.use("/products", productRoutes)
    
    app.use("/search", searchRoutes)

    app.use("/user", userRoute)

    app.use("/chat",authMiddleware.requireAuth, chatRoute)

    app.use("/users",authMiddleware.requireAuth, usersRoute)

    app.use("/rooms-chat",authMiddleware.requireAuth, RoomChatRoute)
}