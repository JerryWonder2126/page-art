"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = (0, tslib_1.__importDefault)(require("express"));
var express_fileupload_1 = (0, tslib_1.__importDefault)(require("express-fileupload"));
var cors_1 = (0, tslib_1.__importDefault)(require("cors"));
var body_parser_1 = (0, tslib_1.__importDefault)(require("body-parser"));
var dotenv_1 = (0, tslib_1.__importDefault)(require("dotenv"));
var artpage_controller_1 = require("./controllers/artpage.controller");
dotenv_1.default.config();
var app = (0, express_1.default)();
var whitelist = [
    'http://localhost:4200',
    'https://jerrywonder2126.github.io',
];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            console.log(origin);
            callback(null, true);
        }
        else {
            callback(new Error("".concat(origin, " not allowed by CORS")));
        }
    },
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use((0, express_fileupload_1.default)());
// const staticPath = path.join(__dirname, '../../frontend/dist/art-page');
// app.use('/', express.static(staticPath));
app.listen(process.env.PORT || 12080);
console.log('ok');
app.use('/resources', artpage_controller_1.router);
//# sourceMappingURL=index.js.map