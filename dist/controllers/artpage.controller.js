"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var tslib_1 = require("tslib");
var express_1 = (0, tslib_1.__importDefault)(require("express"));
var offer_model_1 = require("../models/offer.model");
var section_model_1 = require("../models/section.model");
var social_service_1 = require("../services/social/social.service");
var router = express_1.default.Router();
exports.router = router;
router.get('/sections/', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var result;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, section_model_1.SectionModel.fetchSections()];
            case 1:
                result = _a.sent();
                if (result.error) {
                    res.status(404);
                }
                res.status(200).send(result);
                return [2 /*return*/];
        }
    });
}); });
router.post('/sections', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var imageFile, result;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                imageFile = req['files'] ? req['files'].image : null;
                return [4 /*yield*/, section_model_1.SectionModel.addSection(req.body.title, imageFile)];
            case 1:
                result = _a.sent();
                if (result.error) {
                    res.status(404);
                }
                res.status(201).send(result);
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
                return [4 /*yield*/, section_model_1.SectionModel.update(req.body, image)];
            case 1:
                result = (_a.sent());
                if (result.error) {
                    res.status(404);
                }
                res.status(201).send(result);
                return [2 /*return*/];
        }
    });
}); });
router.delete('/sections', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var result;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, section_model_1.SectionModel.deleteSection(req.query.section_hash)];
            case 1:
                result = _a.sent();
                if (result.error) {
                    res.status(404);
                }
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
router.get('/offers/', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var response, MAX_NUM;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.uhash) return [3 /*break*/, 2];
                return [4 /*yield*/, offer_model_1.OfferModel.fetchOffer(req.query.uhash)];
            case 1:
                // Get offer by unique hash id
                response = _a.sent();
                return [3 /*break*/, 6];
            case 2:
                if (!req.query.latest) return [3 /*break*/, 4];
                MAX_NUM = 8;
                return [4 /*yield*/, offer_model_1.OfferModel.getLatestOffers(MAX_NUM)];
            case 3:
                response = _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, offer_model_1.OfferModel.fetchOffers(req.query.section)];
            case 5:
                // Get all offers under a particular section
                response = _a.sent();
                _a.label = 6;
            case 6:
                if (response.error) {
                    res.status(404);
                }
                res.status(200).send(response);
                return [2 /*return*/];
        }
    });
}); });
router.post('/offers/', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var result, body, images, imgFiles, presentYear, title, short_description, long_description, price, section_hash, artist, medium, year, dimension, orientation;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = {
                    rows: [],
                    error: '',
                };
                body = JSON.parse(req.body.data);
                images = [];
                imgFiles = req['files'];
                presentYear = new Date();
                if (imgFiles) {
                    Object.keys(imgFiles).forEach(function (key) { return images.push(imgFiles[key]); });
                }
                title = body.title ? body.title : '';
                short_description = body.short_description
                    ? body.short_description
                    : '';
                long_description = body.long_description ? body.long_description : '';
                price = body.price ? body.price : '';
                section_hash = body.section_hash ? body.section_hash : '';
                artist = body.artist ? body.artist : '';
                medium = body.medium ? body.medium : '';
                year = body.year ? body.year : presentYear.getFullYear();
                dimension = body.dimension ? body.dimension : '';
                orientation = body.orientation ? body.orientation : '';
                return [4 /*yield*/, offer_model_1.OfferModel.createOffer(title, short_description, long_description, price, images, section_hash, artist, medium, year, dimension, orientation)];
            case 1:
                result = _a.sent();
                if (result.error) {
                    res.status(404);
                }
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
router.put('/offers/', function (req, res) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var images, imgFiles, body, result;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                images = [];
                imgFiles = req['files'];
                if (imgFiles) {
                    Object.keys(imgFiles).forEach(function (key) { return images.push(imgFiles[key]); });
                }
                body = JSON.parse(req.body.data);
                return [4 /*yield*/, offer_model_1.OfferModel.update(body, req.query.type, images)];
            case 1:
                result = (_a.sent());
                if (result.error) {
                    res.status(404);
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
            case 0: return [4 /*yield*/, offer_model_1.OfferModel.deleteOffer(req.query.offer_hash)];
            case 1:
                result = _a.sent();
                if (result.error) {
                    res.status(404);
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
                res.status(404);
                result.error += "\n".concat(err_1);
                return [3 /*break*/, 6];
            case 6:
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=artpage.controller.js.map