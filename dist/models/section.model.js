"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionModel = void 0;
var tslib_1 = require("tslib");
var uuid_1 = require("uuid");
var db_1 = require("../db");
var azure_service_1 = require("../services/azure/azure.service");
var upload_image_service_1 = require("../services/upload/upload-image.service");
var helpers_1 = require("./helpers");
var SectionsModel = /** @class */ (function () {
    // tableName is the name of this model's table in the database
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
                        response.rows = (0, upload_image_service_1.parseImgURL)(res.rows, true); // Add image_url_prefix to images name in result
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
                        (0, helpers_1.handleError)(response, err_3);
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
                        (0, helpers_1.handleError)(response, err_4);
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
                        return [4 /*yield*/, (0, upload_image_service_1.deleteSingleImage)((0, upload_image_service_1.deparseImgURL)([body.value])[0] // The first item is the image name, since it's a single image
                            )];
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
                        (0, helpers_1.handleError)(response, err_5);
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
                        (0, helpers_1.handleError)(response, err_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    return SectionsModel;
}());
var SectionModel = new SectionsModel();
exports.SectionModel = SectionModel;
//# sourceMappingURL=section.model.js.map