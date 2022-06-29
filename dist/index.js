"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = (0, tslib_1.__importDefault)(require("express"));
var express_fileupload_1 = (0, tslib_1.__importDefault)(require("express-fileupload"));
var cors_1 = (0, tslib_1.__importDefault)(require("cors"));
var body_parser_1 = (0, tslib_1.__importDefault)(require("body-parser"));
var dotenv_1 = (0, tslib_1.__importDefault)(require("dotenv"));
var ejs_1 = (0, tslib_1.__importDefault)(require("ejs"));
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var express_session_1 = (0, tslib_1.__importDefault)(require("express-session"));
var connect_pg_simple_1 = (0, tslib_1.__importDefault)(require("connect-pg-simple"));
var BASE_DIR = path_1.default.join(__dirname, '../');
var BASE_URL = '/api/v1';
dotenv_1.default.config({ path: path_1.default.join(BASE_DIR, '.env') });
var artpage_controller_1 = require("./controllers/artpage.controller");
var auth_controller_1 = require("./controllers/auth.controller");
var app = (0, express_1.default)();
var whitelist = process.env.BASE_URLs
    ? process.env.BASE_URLs.split(',')
    : [];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("".concat(origin, " not allowed by CORS")));
        }
    },
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions)); // This enables CORS on API
// app.use(bodyParser.json());
app.use((0, express_session_1.default)({
    store: new ((0, connect_pg_simple_1.default)(express_session_1.default))({
        // Insert connect-pg-simple options here
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    // Insert express-session options here
    saveUninitialized: false,
}));
var bounceUnathenticated = function (req, res, next) {
    var session = req.session.authenticated;
    if (session) {
        // Run checks
        console.log(req.session);
        next();
        res.end();
    }
    res.status(403).send('Access denied');
    // res.end();
};
app.set('view engine', ejs_1.default);
app.use(express_1.default.static(path_1.default.join(BASE_DIR, 'static')));
app.use((0, express_fileupload_1.default)()); // This enables file-uploads through forms
app.use("".concat(BASE_URL), body_parser_1.default.json(), artpage_controller_1.router); // For performing CRUD operations on table
app.use("".concat(BASE_URL, "/auth"), bounceUnathenticated, express_1.default.urlencoded({ extended: false }), auth_controller_1.router); // For performing authentication
app.listen(process.env.PORT || 12080);
//# sourceMappingURL=index.js.map