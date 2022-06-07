"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factories = void 0;
const types_1 = require("./injection/types");
const injektor_1 = require("@zimtsui/injektor");
class Factories {
}
__decorate([
    (0, injektor_1.instantInject)(types_1.TYPES.StoppedFactory)
], Factories.prototype, "stopped", void 0);
__decorate([
    (0, injektor_1.instantInject)(types_1.TYPES.StartingFactory)
], Factories.prototype, "starting", void 0);
__decorate([
    (0, injektor_1.instantInject)(types_1.TYPES.StartedFactory)
], Factories.prototype, "started", void 0);
__decorate([
    (0, injektor_1.instantInject)(types_1.TYPES.StoppingFactory)
], Factories.prototype, "stopping", void 0);
exports.Factories = Factories;
//# sourceMappingURL=factories.js.map