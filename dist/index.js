"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = (0, tslib_1.__importDefault)(require("express"));
var express_fileupload_1 = (0, tslib_1.__importDefault)(require("express-fileupload"));
var cors_1 = (0, tslib_1.__importDefault)(require("cors"));
var body_parser_1 = (0, tslib_1.__importDefault)(require("body-parser"));
var dotenv_1 = (0, tslib_1.__importDefault)(require("dotenv"));
var artpage_controller_1 = require("./controllers/artpage.controller");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
dotenv_1.default.config();
var app = (0, express_1.default)();
var whitelist = ['http://localhost:4200', 'http://example2.com'];
var corsOptions = {
    origin: whitelist[0],
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use((0, express_fileupload_1.default)());
var staticPath = path_1.default.join(__dirname, '../../frontend/dist/art-page');
app.use('/', express_1.default.static(staticPath));
app.listen(process.env.PORT || 12080, function () {
    console.log('application now running on port 3000');
});
console.log(staticPath);
app.use('/resources', artpage_controller_1.router);
//# sourceMappingURL=index.js.map