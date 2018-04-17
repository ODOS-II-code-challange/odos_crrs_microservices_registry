"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./vendor.ts");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var ng2_webstorage_1 = require("ng2-webstorage");
var shared_1 = require("./shared");
var home_module_1 = require("./home/home.module");
var admin_module_1 = require("./admin/admin.module");
var registry_module_1 = require("./registry/registry.module");
var http_provider_1 = require("./blocks/interceptor/http.provider");
var uib_pagination_config_1 = require("./blocks/config/uib-pagination.config");
var layouts_1 = require("./layouts");
var JHipsterRegistryAppModule = (function () {
    function JHipsterRegistryAppModule() {
    }
    return JHipsterRegistryAppModule;
}());
JHipsterRegistryAppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            layouts_1.LayoutRoutingModule,
            ng2_webstorage_1.Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
            shared_1.JHipsterRegistrySharedModule,
            home_module_1.JHipsterRegistryHomeModule,
            admin_module_1.JHipsterRegistryAdminModule,
            registry_module_1.JHipsterRegistryModule
        ],
        declarations: [
            layouts_1.JhiMainComponent,
            layouts_1.NavbarComponent,
            layouts_1.ErrorComponent,
            layouts_1.PageRibbonComponent,
            layouts_1.FooterComponent
        ],
        providers: [
            layouts_1.ProfileService,
            http_provider_1.customHttpProvider(),
            uib_pagination_config_1.PaginationConfig,
            shared_1.UserRouteAccessService
        ],
        bootstrap: [layouts_1.JhiMainComponent]
    })
], JHipsterRegistryAppModule);
exports.JHipsterRegistryAppModule = JHipsterRegistryAppModule;
//# sourceMappingURL=app.module.js.map