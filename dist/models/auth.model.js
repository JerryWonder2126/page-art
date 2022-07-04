"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var tslib_1 = require("tslib");
var db_1 = require("../db");
var bcrypt_1 = (0, tslib_1.__importDefault)(require("bcrypt"));
// const bcrypt = require('bcrypt');
var Users = /** @class */ (function () {
    function Users(table) {
        if (table === void 0) { table = 'users'; }
        this.table = table;
    }
    Users.prototype.create = function (email, password) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var hashed_password, query, response, err_1;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.hashPassword(password)];
                    case 1:
                        hashed_password = _a.sent();
                        query = "INSERT INTO ".concat(this.table, " (email, password) VALUES ('").concat(email, "', '").concat(hashed_password, "')");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.rows[0]];
                    case 3:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Users.prototype.exists = function (email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var query, response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select exists(select 1 from ".concat(this.table, " where email='").concat(email, "')");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.rows[0].exists];
                }
            });
        });
    };
    Users.prototype.get = function (email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var query, response, _a;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        query = "SELECT * FROM ".concat(this.table, " WHERE email='").concat(email, "'");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, response.rows[0]];
                    case 2:
                        _a = _b.sent();
                        throw new Error("User identified with ".concat(email, " not found."));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Users.prototype.hashPassword = function (password) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var saltRounds, hashed, err_2;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        saltRounds = 10;
                        return [4 /*yield*/, bcrypt_1.default.hash(password, saltRounds)];
                    case 1:
                        hashed = _a.sent();
                        return [2 /*return*/, hashed];
                    case 2:
                        err_2 = _a.sent();
                        throw new Error('Provided password can not be used');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Users.prototype.verify = function (email, password) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var passwordValid, userExists, user, hashedPassword, err_3;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        passwordValid = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.exists(email)];
                    case 2:
                        userExists = _a.sent();
                        if (!userExists) {
                            throw new Error('User not found');
                        }
                        return [4 /*yield*/, this.get(email)];
                    case 3:
                        user = _a.sent();
                        return [4 /*yield*/, this.hashPassword(password)];
                    case 4:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                    case 5:
                        passwordValid = _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_3 = _a.sent();
                        console.log(err_3);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, passwordValid];
                }
            });
        });
    };
    return Users;
}());
var User = new Users();
exports.User = User;
//# sourceMappingURL=auth.model.js.map