const express = require('express');
const app = express();
const flash = require('express-flash');//Thư viện in ra thông báo
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
var path = require('path');
const http = require('http');
const { Server } = require("socket.io");
const moment = require("moment")

// Tải biến môi trường
require('dotenv').config();

// Nhập và cấu hình cơ sở dữ liệu
const database = require("./config/database.js");
database.connect(); // Kết nối với cơ sở dữ liệu

// Nhập cấu hình
const systemConfig = require("./config/system.js");

// Nhập các route
const routeAdmin = require("./routes/admin/index.route.js");
const route = require("./routes/client/index.route.js");

// Cấu hình middleware
app.use(methodOverride('_method')); // Phải đặt trước các middleware khác

// Cấu hình Pug làm engine template
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

//Socket io: chat realtime
const server = http.createServer(app);
const io = new Server(server);

global._io = io

// Static files: thiết lập folder public là file tĩnh để công khai ra bên ngoài
console.log(__dirname)
app.use(express.static(`${__dirname}/public`)); //__dirname: chính là "E:\Back-end\product-management" (do trên online nó k hiểu public là gì nên ta phải thêm __dirname vào)

// Middleware để xử lý dữ liệu URL-encoded từ các form HTML
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware để xử lý dữ liệu JSON được gửi trong body của request
app.use(bodyParser.json());

// App local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Khởi tạo session và flash
app.use(cookieParser('Tienanh@123'));
app.use(session({
  secret: 'your-secret-key', // Thay đổi thành chuỗi bí mật của bạn
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 } // Thay đổi thời gian lưu cookie nếu cần
}));
app.use(flash());

//TinyMCE
app.use(
  '/tinymce', 
  express.static(path.join(__dirname, 'node_modules', 'tinymce')
));

// Định nghĩa các route
routeAdmin(app);
route(app);

app.get("*", (req, res) =>{
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found"
  })
})

// Khởi động server
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
