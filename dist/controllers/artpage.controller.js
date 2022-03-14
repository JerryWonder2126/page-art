"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var tslib_1 = require("tslib");
var express_1 = (0, tslib_1.__importDefault)(require("express"));
var artpictures_model_1 = require("../models/artpictures.model");
var social_service_1 = require("../services/social/social.service");
// const {title} = require('process');
var router = express_1.default.Router();
exports.router = router;
router.get('/sections/', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var result;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, artpictures_model_1.SectionModel.fetchSections()];
            case 1:
                result = _a.sent();
                if (result.error) {
                    res.statusCode = 404;
                }
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
router.post('/sections', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var imageFile, result;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                imageFile = req['files'].image;
                return [4 /*yield*/, artpictures_model_1.SectionModel.addSection(req.body.title, imageFile)];
            case 1:
                result = _a.sent();
                if (result.error) {
                    res.statusCode = 404;
                }
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
router.put('/sections/', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var image, result;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                image = req['files'] ? req['files'].image : undefined;
                return [4 /*yield*/, artpictures_model_1.SectionModel.update(req.body, image)];
            case 1:
                result = (_a.sent());
                if (result.error) {
                    res.statusCode = 404;
                }
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
router.delete('/sections', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var result;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, artpictures_model_1.SectionModel.deleteSection(req.query.section_hash)];
            case 1:
                result = _a.sent();
                if (result.error) {
                    res.statusCode = 404;
                }
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
router.get('/offers/', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var response;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, artpictures_model_1.OfferModel.fetchOffers(req.query.section)];
            case 1:
                response = _a.sent();
                if (response.error) {
                    res.statusCode = 400;
                }
                res.send(response);
                return [2 /*return*/];
        }
    });
}); });
router.post('/offers/', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var result, body, images;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = {
                    rows: [],
                    error: '',
                };
                body = JSON.parse(req.body.data);
                images = [];
                Object.keys(req['files']).forEach(function (key) { return images.push(req.files[key]); });
                return [4 /*yield*/, artpictures_model_1.OfferModel.createOffer(body.title, body.short_description, body.long_description, body.price, images, body.section_hash, body.artist, body.medium, body.year, body.dimension, body.orientation)];
            case 1:
                result = _a.sent();
                if (result.error) {
                    res.statusCode = 404;
                }
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
router.put('/offers/', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var images, body, result;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                images = [];
                if (req['files']) {
                    Object.keys(req['files']).forEach(function (key) {
                        return images.push(req.files[key]);
                    });
                }
                body = JSON.parse(req.body.data);
                return [4 /*yield*/, artpictures_model_1.OfferModel.update(body, req.query.type, images)];
            case 1:
                result = (_a.sent());
                if (result.error) {
                    res.statusCode = 404;
                }
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
router.delete('/offers/', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var result;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, artpictures_model_1.OfferModel.deleteOffer(req.query.offer_hash)];
            case 1:
                result = _a.sent();
                if (result.error) {
                    res.statusCode = 404;
                }
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
router.post('/social/', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var result, response, form, type, err_1;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = {
                    rows: [],
                    error: '',
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                response = { ok: false };
                form = JSON.parse(req.body.data);
                type = req.query.type;
                if (!(type === 'whatsapp')) return [3 /*break*/, 2];
                response = (0, social_service_1.whatsapp)(form);
                if (!response.ok) {
                    throw new Error('Invalid request arguments');
                }
                return [3 /*break*/, 4];
            case 2:
                if (!(type === 'telegram')) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, social_service_1.telegram)(form)];
            case 3:
                response = _a.sent();
                _a.label = 4;
            case 4:
                if (!response.ok) {
                    throw new Error('Invalid request arguments');
                }
                // res.statusCode = 301;
                result.rows.push(response.message);
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                res.statusCode = 400;
                result.error += "\n".concat(err_1);
                return [3 /*break*/, 6];
            case 6:
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=artpage.controller.js.map