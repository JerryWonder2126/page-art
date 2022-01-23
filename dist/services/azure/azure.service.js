"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureService = void 0;
var tslib_1 = require("tslib");
// eslint-disable-next-line node/no-extraneous-import
var storage_blob_1 = require("@azure/storage-blob");
var uuid_1 = require("uuid");
var AzureService = /** @class */ (function () {
    function AzureService(containerName, storageAccountName) {
        this.containerName = containerName;
        this.storageAccountName = storageAccountName;
        this.IMG_URL_PREFIX = "https://".concat(this.storageAccountName, ".blob.core.windows.net/").concat(this.containerName, "/");
        this.AZURE_STORAGE_CONNECTION_STRING = process.env
            .AZURE_STORAGE_CONNECTION_STRING;
    }
    Object.defineProperty(AzureService.prototype, "imgUrlPrefix", {
        get: function () {
            return this.IMG_URL_PREFIX;
        },
        enumerable: false,
        configurable: true
    });
    AzureService.prototype.connectToAzureBlobService = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_blob_1.BlobServiceClient.fromConnectionString(this.AZURE_STORAGE_CONNECTION_STRING)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AzureService.prototype.prepareForConnection = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var blobServiceClient, containerClient, err_1;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connectToAzureBlobService()];
                    case 1:
                        blobServiceClient = _a.sent();
                        return [4 /*yield*/, blobServiceClient.getContainerClient(this.containerName)];
                    case 2:
                        containerClient = _a.sent();
                        return [2 /*return*/, containerClient];
                    case 3:
                        err_1 = _a.sent();
                        throw new Error(JSON.stringify(err_1));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AzureService.prototype.getContainerClient = function (containerName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, err_2;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        if (!containerName) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.connectToAzureBlobService()];
                    case 1: return [4 /*yield*/, (_b.sent()).getContainerClient(containerName)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.prepareForConnection()];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/, _a];
                    case 6:
                        err_2 = _b.sent();
                        throw new Error(JSON.stringify(err_2));
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AzureService.prototype.createNewContainer = function (containerName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, containerClient, err_3;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        // Create a unique name for the container
                        containerName += (0, uuid_1.v1)();
                        return [4 /*yield*/, this.getContainerClient(containerName)];
                    case 2:
                        containerClient = _a.sent();
                        // Create the container
                        return [4 /*yield*/, containerClient.create()];
                    case 3:
                        // Create the container
                        _a.sent();
                        response.name = containerName;
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        response.error = true;
                        throw new Error(JSON.stringify(err_3));
                    case 5: return [2 /*return*/, response];
                }
            });
        });
    };
    AzureService.prototype.uploadToBlob = function (file, containerClient) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, fileName, blockBlobClient, uploadBlobResponse, err_4;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = { name: (0, uuid_1.v1)() };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!!containerClient) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prepareForConnection()];
                    case 2:
                        containerClient = _a.sent();
                        _a.label = 3;
                    case 3:
                        fileName = 'art-page' + (0, uuid_1.v1)();
                        return [4 /*yield*/, containerClient.getBlockBlobClient(fileName)];
                    case 4:
                        blockBlobClient = _a.sent();
                        return [4 /*yield*/, blockBlobClient.upload(file.data, file.size)];
                    case 5:
                        uploadBlobResponse = _a.sent();
                        response.name = fileName;
                        response.requestId = uploadBlobResponse.requestId;
                        return [3 /*break*/, 7];
                    case 6:
                        err_4 = _a.sent();
                        response.error = true;
                        throw new Error(JSON.stringify(err_4));
                    case 7: return [2 /*return*/, response];
                }
            });
        });
    };
    AzureService.prototype.deleteImageFromBlob = function (fileName, containerClient) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response, blockBlobClient, err_5;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = { name: (0, uuid_1.v1)() };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!!containerClient) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prepareForConnection()];
                    case 2:
                        containerClient = _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, containerClient.getBlockBlobClient(fileName)];
                    case 4:
                        blockBlobClient = _a.sent();
                        return [4 /*yield*/, blockBlobClient.delete()];
                    case 5:
                        _a.sent();
                        response.name = fileName;
                        return [3 /*break*/, 7];
                    case 6:
                        err_5 = _a.sent();
                        if (err_5.RestError !== 'The specified blob does not exist.') {
                            response.error = true;
                            throw new Error(JSON.stringify(err_5));
                        }
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, response];
                }
            });
        });
    };
    return AzureService;
}());
exports.AzureService = AzureService;
//# sourceMappingURL=azure.service.js.map