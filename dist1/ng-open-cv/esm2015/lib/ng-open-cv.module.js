/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { NgOpenCVService, OPEN_CV_CONFIGURATION } from './ng-open-cv.service';
export class NgOpenCVModule {
    /**
     *
     * Setup the module in your application's root bootstrap.
     *
     *
     * \@memberOf NgOpenCvModule
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: NgOpenCVModule,
            providers: [{ provide: OPEN_CV_CONFIGURATION, useValue: config }]
        };
    }
}
NgOpenCVModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                declarations: [],
                exports: [],
                providers: [NgOpenCVService]
            },] }
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctb3Blbi1jdi5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1vcGVuLWN2LyIsInNvdXJjZXMiOlsibGliL25nLW9wZW4tY3YubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsZUFBZSxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFTOUUsTUFBTTs7Ozs7Ozs7OztJQVFKLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBcUI7UUFDbEMsT0FBTztZQUNMLFFBQVEsRUFBRSxjQUFjO1lBQ3hCLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztTQUNsRSxDQUFDO0tBQ0g7OztZQW5CRixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsWUFBWSxFQUFFLEVBQUU7Z0JBQ2hCLE9BQU8sRUFBRSxFQUFFO2dCQUNYLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQzthQUM3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ09wZW5DVlNlcnZpY2UsIE9QRU5fQ1ZfQ09ORklHVVJBVElPTiB9IGZyb20gJy4vbmctb3Blbi1jdi5zZXJ2aWNlJztcbmltcG9ydCB7IE9wZW5DVk9wdGlvbnMgfSBmcm9tICcuL25nLW9wZW4tY3YubW9kZWxzJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW10sXG4gIGRlY2xhcmF0aW9uczogW10sXG4gIGV4cG9ydHM6IFtdLFxuICBwcm92aWRlcnM6IFtOZ09wZW5DVlNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIE5nT3BlbkNWTW9kdWxlIHtcbiAgLyoqXG4gICAqXG4gICAqIFNldHVwIHRoZSBtb2R1bGUgaW4geW91ciBhcHBsaWNhdGlvbidzIHJvb3QgYm9vdHN0cmFwLlxuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgTmdPcGVuQ3ZNb2R1bGVcbiAgICovXG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZzogT3BlbkNWT3B0aW9ucyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTmdPcGVuQ1ZNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE9QRU5fQ1ZfQ09ORklHVVJBVElPTiwgdXNlVmFsdWU6IGNvbmZpZyB9XVxuICAgIH07XG4gIH1cbn1cbiJdfQ==