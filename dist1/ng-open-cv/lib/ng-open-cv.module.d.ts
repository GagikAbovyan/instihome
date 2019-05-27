import { ModuleWithProviders } from '@angular/core';
import { OpenCVOptions } from './ng-open-cv.models';
export declare class NgOpenCVModule {
    /**
     *
     * Setup the module in your application's root bootstrap.
     *
     *
     * @memberOf NgOpenCvModule
     */
    static forRoot(config: OpenCVOptions): ModuleWithProviders;
}
