"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.telegram = exports.whatsapp = void 0;
var tslib_1 = require("tslib");
// import got from 'got';
function whatsapp(form) {
    var response = { ok: false };
    try {
        var ownersNumber = process.env.WHATSAPP_NUMBER;
        if (!ownersNumber) {
            throw new Error('System error! Cannot send message to telegram');
        }
        var message = "Hello, SinaArtz! ".concat(form.message, ". Thank you.");
        var url = "https://wa.me/".concat(ownersNumber, "?text=").concat(message);
        response.ok = true;
        response.message = url;
    }
    catch (err) {
        response.error = err;
    }
    return response;
}
exports.whatsapp = whatsapp;
function telegram(form) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var response, token, message, data, url, postResponse, err_1;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    response = { ok: false };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    token = process.env.TELEGRAM_BOT_TOKEN;
                    if (token) {
                        throw new Error('System error! Cannot send message to telegram');
                    }
                    message = "<b>Hello, SinaArtz!</b>\n\n".concat(form.message, ".\n\n<b>You can reach me through ").concat(form.email, ". Thank you.</b>");
                    data = {
                        chat_id: '1249927233',
                        text: message,
                        parse_mode: 'html',
                    };
                    url = "https://api.telegram.org/bot".concat(token, "/sendMessage");
                    return [4 /*yield*/, handleRequest(url, data)];
                case 2:
                    postResponse = _a.sent();
                    response.ok = true;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    response.error = JSON.stringify(err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, response];
            }
        });
    });
}
exports.telegram = telegram;
function handleRequest(url, body) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        return (0, tslib_1.__generator)(this, function (_a) {
            try {
                // const telegramResponse = await got.post(url, {json: body});
                // return telegramResponse.body;
            }
            catch (error) {
                throw new Error(error.response.body);
            }
            return [2 /*return*/];
        });
    });
}
//# sourceMappingURL=social.service.js.map