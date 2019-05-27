/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { NgOpenCVService, OPEN_CV_CONFIGURATION } from './ng-open-cv.service';
var NgOpenCVModule = /** @class */ (function () {
    function NgOpenCVModule() {
    }
    /**
     *
     * Setup the module in your application's root bootstrap.
     *
     *
     * @memberOf NgOpenCvModule
     */
    /**
     *
     * Setup the module in your application's root bootstrap.
     *
     *
     * \@memberOf NgOpenCvModule
     * @param {?} config
     * @return {?}
     */
    NgOpenCVModule.forRoot = /**
     *
     * Setup the module in your application's root bootstrap.
     *
     *
     * \@memberOf NgOpenCvModule
     * @param {?} config
     * @return {?}
     */
    function (config) {
        return {
            ngModule: NgOpenCVModule,
            providers: [{ provide: OPEN_CV_CONFIGURATION, useValue: config }]
        };
    };
    NgOpenCVModule.decorators = [
        { type: NgModule, args: [{
                    imports: [],
                    declarations: [],
                    exports: [],
                    providers: [NgOpenCVService]
                },] }
    ];
    return NgOpenCVModule;
}());
export { NgOpenCVModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctb3Blbi1jdi5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1vcGVuLWN2LyIsInNvdXJjZXMiOlsibGliL25nLW9wZW4tY3YubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsZUFBZSxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7SUFVNUU7Ozs7OztPQU1HOzs7Ozs7Ozs7O0lBQ0ksc0JBQU87Ozs7Ozs7OztJQUFkLFVBQWUsTUFBcUI7UUFDbEMsT0FBTztZQUNMLFFBQVEsRUFBRSxjQUFjO1lBQ3hCLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztTQUNsRSxDQUFDO0tBQ0g7O2dCQW5CRixRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLEVBQUU7b0JBQ1gsWUFBWSxFQUFFLEVBQUU7b0JBQ2hCLE9BQU8sRUFBRSxFQUFFO29CQUNYLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQztpQkFDN0I7O3lCQVREOztTQVVhLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdPcGVuQ1ZTZXJ2aWNlLCBPUEVOX0NWX0NPTkZJR1VSQVRJT04gfSBmcm9tICcuL25nLW9wZW4tY3Yuc2VydmljZSc7XG5pbXBvcnQgeyBPcGVuQ1ZPcHRpb25zIH0gZnJvbSAnLi9uZy1vcGVuLWN2Lm1vZGVscyc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtdLFxuICBkZWNsYXJhdGlvbnM6IFtdLFxuICBleHBvcnRzOiBbXSxcbiAgcHJvdmlkZXJzOiBbTmdPcGVuQ1ZTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBOZ09wZW5DVk1vZHVsZSB7XG4gIC8qKlxuICAgKlxuICAgKiBTZXR1cCB0aGUgbW9kdWxlIGluIHlvdXIgYXBwbGljYXRpb24ncyByb290IGJvb3RzdHJhcC5cbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIE5nT3BlbkN2TW9kdWxlXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IE9wZW5DVk9wdGlvbnMpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IE5nT3BlbkNWTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBPUEVOX0NWX0NPTkZJR1VSQVRJT04sIHVzZVZhbHVlOiBjb25maWcgfV1cbiAgICB9O1xuICB9XG59XG4iXX0=