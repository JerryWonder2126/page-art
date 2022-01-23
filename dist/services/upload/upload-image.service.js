"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deparseImgURL = exports.parseImgURL = exports.deleteSingleImage = exports.updateSingleImage = exports.saveImageBatch = exports.saveImage = void 0;
var tslib_1 = require("tslib");
var azure_service_1 = require("../azure/azure.service");
function saveImage(image) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var azureHook, azureResponse, err_1;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, init()];
                case 1:
                    azureHook = _a.sent();
                    return [4 /*yield*/, azureHook.uploadToBlob(image)];
                case 2:
                    azureResponse = _a.sent();
                    return [2 /*return*/, azureResponse.name];
                case 3:
                    err_1 = _a.sent();
                    throw new Error(JSON.stringify({
                        stack: "Image could not be uploaded, please try again.\n".concat(err_1),
                    }));
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.saveImage = saveImage;
function saveImageBatch(images) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var imagesPromise_1, err_2;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    imagesPromise_1 = [];
                    Object.keys(images).forEach(function (value, index) {
                        return imagesPromise_1.push(saveImage(images[index]));
                    });
                    return [4 /*yield*/, Promise.all(imagesPromise_1)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_2 = _a.sent();
                    throw new Error(JSON.stringify({
                        stack: "Images could not be uploaded, please try again.\n".concat(err_2),
                    }));
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.saveImageBatch = saveImageBatch;
function updateSingleImage(image) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        return (0, tslib_1.__generator)(this, function (_a) {
            try {
                return [2 /*return*/, saveImage(image)];
            }
            catch (err) {
                throw new Error(JSON.stringify({
                    stack: "Images could not be updated, please try again.\n".concat(err),
                }));
            }
            return [2 /*return*/];
        });
    });
}
exports.updateSingleImage = updateSingleImage;
function deleteSingleImage(fileName) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var azureHook, err_3;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, init()];
                case 1:
                    azureHook = _a.sent();
                    return [4 /*yield*/, azureHook.deleteImageFromBlob(fileName)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    err_3 = _a.sent();
                    throw new Error(JSON.stringify({
                        stack: "Image could not be deleted, please try again.\n".concat(err_3),
                    }));
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.deleteSingleImage = deleteSingleImage;
function init() {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var err_4;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new azure_service_1.AzureService(containerName, storageAccountName)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_4 = _a.sent();
                    throw new Error(JSON.stringify({
                        stack: "Couldn't connect to Azure Server, please try again.",
                    }));
                case 3: return [2 /*return*/];
            }
        });
    });
}
var storageAccountName = 'culdevtest';
var containerName = 'images';
var IMG_URL_PREFIX = "https://".concat(storageAccountName, ".blob.core.windows.net/").concat(containerName, "/");
function parseImgURL(results, singleImage) {
    if (singleImage === void 0) { singleImage = false; }
    return results.map(function (val) {
        if (singleImage) {
            val.imgurl = IMG_URL_PREFIX + val.imgurl;
        }
        else {
            val.imgurl = val.imgurl.map(function (value) {
                return IMG_URL_PREFIX + value;
            });
        }
        return val;
    });
}
exports.parseImgURL = parseImgURL;
function deparseImgURL(results) {
    return results.map(function (val) { return val.replace(IMG_URL_PREFIX, ''); });
}
exports.deparseImgURL = deparseImgURL;
//# sourceMappingURL=upload-image.service.js.map