"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var tslib_1 = require("tslib");
var express_1 = (0, tslib_1.__importDefault)(require("express"));
var auth_model_1 = require("../models/auth.model");
var router = express_1.default.Router();
exports.router = router;
router.get('/', function (req, res) {
    return res.render('auth/login.ejs');
});
router.post('/', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var email, password, verified;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body['email'];
                password = req.body['password'];
                return [4 /*yield*/, auth_model_1.User.verify(email, password)];
            case 1:
                verified = _a.sent();
                console.log(verified);
                return [2 /*return*/, res.render('auth/login.ejs')];
        }
    });
}); });
router.get('/signup', function (req, res) {
    return res.render('auth/signup.ejs');
});
router.post('/signup', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var email, password, user;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body['email'];
                password = req.body['password'];
                return [4 /*yield*/, auth_model_1.User.create(email, password)];
            case 1:
                user = _a.sent();
                if (user) {
                    console.log(user);
                }
                return [2 /*return*/, res.render('auth/signup.ejs')];
        }
    });
}); });
//# sourceMappingURL=auth.controller.js.map