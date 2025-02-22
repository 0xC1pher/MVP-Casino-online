"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.KYCStatus = exports.User = void 0;
class User {
}
exports.User = User;
var KYCStatus;
(function (KYCStatus) {
    KYCStatus["PENDING"] = "PENDING";
    KYCStatus["IN_REVIEW"] = "IN_REVIEW";
    KYCStatus["APPROVED"] = "APPROVED";
    KYCStatus["REJECTED"] = "REJECTED";
})(KYCStatus = exports.KYCStatus || (exports.KYCStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["PLAYER"] = "PLAYER";
    UserRole["VIP"] = "VIP";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["SUPPORT"] = "SUPPORT";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
//# sourceMappingURL=user.entity.js.map