"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferModel = exports.SectionModel = void 0;
var tslib_1 = require("tslib");
var uuid_1 = require("uuid");
var db_1 = require("../db");
var azure_service_1 = require("../services/azure/azure.service");
var upload_image_service_1 = require("../services/upload/upload-image.service");
var SectionsModel = /** @class */ (function () {
    function SectionsModel(tableName) {
        if (tableName === void 0) { tableName = 'sections'; }
        this.tableName = tableName;
    }
    SectionsModel.prototype.init = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var err_1;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new azure_service_1.AzureService('images', 'culdevtest')];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        throw new Error(JSON.stringify({
                            stack: "Couldn't connect to Azure Server, please try again.",
                        }));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SectionsModel.prototype.fetchSections = function () {
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
                        query = "SELECT * FROM ".concat(this.tableName);
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 2:
                        res = _a.sent();
                        response.rows = (0, upload_image_service_1.parseImgURL)(res.rows, true);
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        response.error = err_2.stack;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    SectionsModel.prototype.addSection = function (title, image) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, azureResponse, query, res, err_3;
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
                        return [4 /*yield*/, (0, upload_image_service_1.saveImage)(image)];
                    case 2:
                        azureResponse = _a.sent();
                        query = "INSERT INTO ".concat(this.tableName, " (title, imgurl, uhash) VALUES ( '").concat(title, "', '").concat(azureResponse, "', '").concat((0, uuid_1.v4)(), "') RETURNING *");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 3:
                        res = _a.sent();
                        response.rows = res.rows;
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        response.error = err_3.stack;
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, response];
                }
            });
        });
    };
    SectionsModel.prototype.updateTitle = function (uhash, title) {
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
                        query = "UPDATE ".concat(this.tableName, " SET title = '").concat(title, "' WHERE uhash = '").concat(uhash, "' RETURNING *");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 2:
                        res = _a.sent();
                        response.rows = res.rows;
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        response.error = err_4.stack;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    SectionsModel.prototype.updateImgurl = function (body, image) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, deleteHandle, azureResponse, query, res, err_5;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            rows: [],
                            error: '',
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, (0, upload_image_service_1.deleteSingleImage)((0, upload_image_service_1.deparseImgURL)([body.value])[0])];
                    case 2:
                        deleteHandle = _a.sent();
                        if (!deleteHandle) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, upload_image_service_1.updateSingleImage)(image)];
                    case 3:
                        azureResponse = _a.sent();
                        query = "UPDATE ".concat(this.tableName, " SET imgurl = '").concat(azureResponse, "' WHERE uhash = '").concat(body.uhash, "' RETURNING *");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 4:
                        res = _a.sent();
                        response.rows = res.rows;
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_5 = _a.sent();
                        response.error = err_5.stack;
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, response];
                }
            });
        });
    };
    SectionsModel.prototype.update = function (body, file) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            rows: [],
                            error: '',
                        };
                        if (!(body.type === 'title')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updateTitle(body.uhash, body.value)];
                    case 1:
                        response = _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(body.type === 'imgurl')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.updateImgurl(body, file)];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        response.error = 'Input error - undefined update type for section';
                        _a.label = 5;
                    case 5: return [2 /*return*/, response];
                }
            });
        });
    };
    SectionsModel.prototype.deleteSection = function (uhash) {
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
                        query = "DELETE FROM ".concat(this.tableName, " WHERE uhash = '").concat(uhash, "'");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 2:
                        res = _a.sent();
                        if (res) {
                            response.rows = [{ message: 'Section deleted successfully' }];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _a.sent();
                        response.error = err_6.stack;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    return SectionsModel;
}());
var OffersModel = /** @class */ (function () {
    function OffersModel(tableName) {
        if (tableName === void 0) { tableName = 'offers'; }
        this.tableName = tableName;
    }
    OffersModel.prototype.createOffer = function (title, short_description, long_description, price, images, section_hash) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, azureResponse, parsedImgURL, query, res, err_7;
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
                        query = "INSERT INTO ".concat(this.tableName, " (\n        title, short_description, long_description, price, imgurl, uhash, section_hash)\n        VALUES ('").concat(title, "', '").concat(short_description, "','").concat(long_description, "', '").concat(price, "', '").concat(parsedImgURL, "', '").concat((0, uuid_1.v4)(), "', '").concat(section_hash, "') RETURNING *;");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 3:
                        res = _a.sent();
                        response.rows = res.rows;
                        return [3 /*break*/, 5];
                    case 4:
                        err_7 = _a.sent();
                        response.error = err_7.stack;
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, response];
                }
            });
        });
    };
    OffersModel.prototype.fetchOffers = function (section_hash) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, query, res, err_8;
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
                        response.rows = (0, upload_image_service_1.parseImgURL)(res.rows);
                        return [3 /*break*/, 4];
                    case 3:
                        err_8 = _a.sent();
                        if ('stack' in err_8) {
                            response.error = err_8.stack;
                        }
                        else {
                            response.error = JSON.stringify(err_8);
                        }
                        response.error = err_8.stack;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    OffersModel.prototype.fetchOffer = function (offer_hash) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, query, res, err_9;
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
                        response.rows = (0, upload_image_service_1.parseImgURL)(res.rows, true);
                        return [3 /*break*/, 4];
                    case 3:
                        err_9 = _a.sent();
                        if ('stack' in err_9) {
                            response.error = err_9.stack;
                        }
                        else {
                            response.error = JSON.stringify(err_9);
                        }
                        response.error = err_9.stack;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    OffersModel.prototype.deleteOffer = function (uhash) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, query, res, err_10;
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
                        err_10 = _a.sent();
                        response.error = err_10.stack;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    OffersModel.prototype.updateOffer = function (body) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, query, res, err_11;
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
                        query = "UPDATE ".concat(this.tableName, " SET \n      title='").concat(body.title, "', \n      long_description='").concat(body.long_description, "', \n      short_description='").concat(body.short_description, "', \n      price='").concat(body.price, "'\n      WHERE uhash = '").concat(body.uhash, "' RETURNING *");
                        return [4 /*yield*/, db_1.client.query(query)];
                    case 2:
                        res = _a.sent();
                        if (res) {
                            response.rows = res.rows;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_11 = _a.sent();
                        response.error = err_11.stack;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    OffersModel.prototype.updateImages = function (body, images) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, imageNames, deleteHandle, query, res, err_12;
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
                        imageNames.push.apply(imageNames, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(body.value), false)); // Add previous names to the list too
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, (0, upload_image_service_1.deleteSingleImage)((0, upload_image_service_1.deparseImgURL)(body.nameToDelete)[0])];
                    case 4:
                        deleteHandle = _a.sent();
                        if (deleteHandle) {
                            imageNames = (0, upload_image_service_1.deparseImgURL)(body.updateWith); // images not given implies there's no need to upload, names have already been provided
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
                        err_12 = _a.sent();
                        response.error = err_12.stack;
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
var SectionModel = new SectionsModel();
exports.SectionModel = SectionModel;
var OfferModel = new OffersModel();
exports.OfferModel = OfferModel;
//# sourceMappingURL=artpictures.model.js.map