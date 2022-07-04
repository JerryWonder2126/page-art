"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
function handleError(response, err) {
    /**
     * Modifies error property on response object
     */
    //   if ('stack' in err) {
    //     response.error = err.stack;
    //   } else {
    //     response.error = JSON.stringify(err);
    //   }
    response.error = err.stack;
}
exports.handleError = handleError;
//# sourceMappingURL=helpers.js.map