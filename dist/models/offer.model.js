"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferModel = void 0;
var tslib_1 = require("tslib");
var uuid_1 = require("uuid");
var db_1 = require("../db");
var upload_image_service_1 = require("../services/upload/upload-image.service");
var helpers_1 = require("./helpers");
var OffersModel = /** @class */ (function () {
    // tableName is model's table name in the database
    function OffersModel(tableName) {
        if (tableName === void 0) { tableName = 'offers'; }
        this.tableName = tableName;
    }
    OffersModel.prototype.createOffer = function (title, short_description, long_description, price, images, section_hash, artist, medium, year, dimension, orientation) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, azureResponse, parsedImgURL, query, res, err_1;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            rows: [],
                            error: '',
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, upload_image_service_1.saveImageBatch)(images)];
                    case 2:
                        azureResponse = _a.sent();
                        parsedImgURL = "{".concat(azureResponse, "}");
                        query = "INSERT INTO ".concat(this.tableName, " (\n        title, short_description, long_description, price, imgurl, uhash, section_hash, artist, medium, year, dimension, orientation)\n        VALUES ('").concat(title, "', '").concat(short_description, "','").concat(long_description, "', '").concat(price, "', '").concat(parsedImgURL, "', '").concat((0, uuid_1.v4)(), "', '").concat(section_hash, "', '").concat(artist, "', '").concat(medium, "', '").concat(year, "', '").concat(dimension, "', '").concat(orientation, "') RETURNING *;");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 3:
                        res = _a.sent();
                        response.rows = res.rows;
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        (0, helpers_1.handleError)(response, err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, response];
                }
            });
        });
    };
    OffersModel.prototype.fetchOffers = function (section_hash) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, query, res, err_2;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            rows: [],
                            error: '',
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        query = "SELECT * FROM ".concat(this.tableName, " WHERE section_hash = '").concat(section_hash, "'");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 2:
                        res = _a.sent();
                        response.rows = (0, upload_image_service_1.parseImgURL)(res.rows); // Add image_url_prefix to image names in result
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        (0, helpers_1.handleError)(response, err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    OffersModel.prototype.fetchOffer = function (offer_hash) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, query, res, err_3;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            rows: [],
                            error: '',
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        query = "SELECT * FROM ".concat(this.tableName, " WHERE uhash = '").concat(offer_hash, "'");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 2:
                        res = _a.sent();
                        response.rows = (0, upload_image_service_1.parseImgURL)(res.rows);
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        (0, helpers_1.handleError)(response, err_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    OffersModel.prototype.getLatestOffers = function (max_num) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, query, res, err_4;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            rows: [],
                            error: '',
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        query = "SELECT * FROM ".concat(this.tableName, " ORDER BY id DESC");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 2:
                        res = _a.sent();
                        response.rows = (0, upload_image_service_1.parseImgURL)(res.rows);
                        response.rows =
                            response.rows.length < max_num
                                ? response.rows
                                : response.rows.slice(0, max_num);
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        (0, helpers_1.handleError)(response, err_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    OffersModel.prototype.deleteOffer = function (uhash) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, query, res, err_5;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            rows: [],
                            error: '',
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        query = "DELETE FROM ".concat(this.tableName, " WHERE uhash = '").concat(uhash, "'");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 2:
                        res = _a.sent();
                        if (res) {
                            response.rows = [{ message: 'Offer deleted successfully' }];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _a.sent();
                        (0, helpers_1.handleError)(response, err_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    OffersModel.prototype.updateOffer = function (body) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, query, res, err_6;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            rows: [],
                            error: '',
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        query = "UPDATE ".concat(this.tableName, " SET \n      title='").concat(body.title, "', \n      long_description='").concat(body.long_description, "', \n      short_description='").concat(body.short_description, "', \n      price='").concat(body.price, "',\n      artist='").concat(body.artist, "',\n      medium='").concat(body.medium, "',\n      year='").concat(body.year, "',\n      dimension='").concat(body.dimension, "',\n      orientation='").concat(body.orientation, "'\n      WHERE uhash = '").concat(body.uhash, "' RETURNING *");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 2:
                        res = _a.sent();
                        if (res) {
                            response.rows = res.rows;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _a.sent();
                        (0, helpers_1.handleError)(response, err_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    OffersModel.prototype.updateImages = function (body, images) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, imageNames, deleteHandle, query, res, err_7;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            rows: [],
                            error: '',
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        imageNames = [];
                        if (!images) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, upload_image_service_1.saveImageBatch)(images)];
                    case 2:
                        //If images then carry out uploading operation
                        imageNames = _a.sent();
                        imageNames.push.apply(imageNames, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)((0, upload_image_service_1.deparseImgURL)(body.value)), false)); // Add previous names to the list too
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, (0, upload_image_service_1.deleteSingleImage)((0, upload_image_service_1.deparseImgURL)(body.nameToDelete)[0])];
                    case 4:
                        deleteHandle = _a.sent();
                        if (deleteHandle) {
                            imageNames = (0, upload_image_service_1.deparseImgURL)(body.updateWith); // images not given implies there's no need to upload, names have already been provided (in body)
                        }
                        _a.label = 5;
                    case 5:
                        query = "UPDATE ".concat(this.tableName, " SET \n      imgurl='{").concat(imageNames, "}'\n      WHERE uhash = '").concat(body.uhash, "' RETURNING *");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 6:
                        res = _a.sent();
                        if (res) {
                            response.rows = res.rows;
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        err_7 = _a.sent();
                        (0, helpers_1.handleError)(response, err_7);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, response];
                }
            });
        });
    };
    OffersModel.prototype.update = function (body, type, images) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            rows: [],
                            error: '',
                        };
                        if (!(type === 'text')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updateOffer(body)];
                    case 1:
                        response = _a.sent();
                        return [3 /*break*/, 8];
                    case 2:
                        if (!(type === 'imgurl')) return [3 /*break*/, 7];
                        if (!images.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.updateImages(body, images)];
                    case 3:
                        // Update image names and upload images
                        response = _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.updateImages(body)];
                    case 5:
                        // simply update image names
                        response = _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        response.error = 'Input error - undefined update type for offer';
                        _a.label = 8;
                    case 8: return [2 /*return*/, response];
                }
            });
        });
    };
    return OffersModel;
}());
var OfferModel = new OffersModel();
exports.OfferModel = OfferModel;
//# sourceMappingURL=offer.model.js.map