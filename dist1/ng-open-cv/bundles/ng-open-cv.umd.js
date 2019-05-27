(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('ng-open-cv', ['exports', '@angular/core', 'rxjs'], factory) :
    (factory((global['ng-open-cv'] = {}),global.ng.core,global.rxjs));
}(this, (function (exports,i0,rxjs) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var OPEN_CV_CONFIGURATION = new i0.InjectionToken('Angular OpenCV Configuration Object');
    var NgOpenCVService = /** @class */ (function () {
        function NgOpenCVService(options) {
            this.src = null;
            this.dstC1 = null;
            this.dstC3 = null;
            this.dstC4 = null;
            this.isReady = new rxjs.BehaviorSubject({
                ready: false,
                error: false,
                loading: true
            });
            this.isReady$ = this.isReady.asObservable();
            this.OPENCV_URL = 'opencv.js';
            this.DEFAULT_OPTIONS = {
                scriptUrl: 'assets/opencv/asm/3.4/opencv.js',
                wasmBinaryFile: 'wasm/3.4/opencv_js.wasm',
                usingWasm: false,
                locateFile: this.locateFile.bind(this),
                onRuntimeInitialized: function () { }
            };
            this.setScriptUrl(options.scriptUrl);
            /** @type {?} */
            var opts = __assign({}, this.DEFAULT_OPTIONS, { options: options });
            this.loadOpenCv(opts);
        }
        /**
         * @param {?} path
         * @param {?} scriptDirectory
         * @return {?}
         */
        NgOpenCVService.prototype.locateFile = /**
         * @param {?} path
         * @param {?} scriptDirectory
         * @return {?}
         */
            function (path, scriptDirectory) {
                if (path === 'opencv_js.wasm') {
                    return scriptDirectory + '/wasm/' + path;
                }
                else {
                    return scriptDirectory + path;
                }
            };
        /**
         * @param {?} url
         * @return {?}
         */
        NgOpenCVService.prototype.setScriptUrl = /**
         * @param {?} url
         * @return {?}
         */
            function (url) {
                this.OPENCV_URL = url;
            };
        /**
         * @param {?} options
         * @return {?}
         */
        NgOpenCVService.prototype.loadOpenCv = /**
         * @param {?} options
         * @return {?}
         */
            function (options) {
                var _this = this;
                this.isReady.next({
                    ready: false,
                    error: false,
                    loading: true
                });
                window['Module'] = __assign({}, options);
                /** @type {?} */
                var script = document.createElement('script');
                script.setAttribute('async', '');
                script.setAttribute('type', 'text/javascript');
                script.addEventListener('load', function () {
                    if (options.onRuntimeInitialized) {
                        options.onRuntimeInitialized();
                    }
                    _this.isReady.next({
                        ready: true,
                        error: false,
                        loading: false
                    });
                });
                script.addEventListener('error', function () {
                    /** @type {?} */
                    var err = _this.printError('Failed to load ' + _this.OPENCV_URL);
                    _this.isReady.next({
                        ready: false,
                        error: true,
                        loading: false
                    });
                    _this.isReady.error(err);
                });
                script.src = this.OPENCV_URL;
                /** @type {?} */
                var node = document.getElementsByTagName('script')[0];
                if (node) {
                    node.parentNode.insertBefore(script, node);
                }
                else {
                    document.head.appendChild(script);
                }
            };
        /**
         * @param {?} path
         * @param {?} url
         * @return {?}
         */
        NgOpenCVService.prototype.createFileFromUrl = /**
         * @param {?} path
         * @param {?} url
         * @return {?}
         */
            function (path, url) {
                var _this = this;
                /** @type {?} */
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'arraybuffer';
                return new rxjs.Observable(function (observer) {
                    var next = observer.next, catchError = observer.error, complete = observer.complete;
                    request.onload = function (ev) {
                        if (request.readyState === 4) {
                            if (request.status === 200) {
                                /** @type {?} */
                                var data = new Uint8Array(request.response);
                                cv.FS_createDataFile('/', path, data, true, false, false);
                                observer.next();
                                observer.complete();
                            }
                            else {
                                _this.printError('Failed to load ' + url + ' status: ' + request.status);
                                observer.error();
                            }
                        }
                    };
                    request.send();
                });
            };
        /**
         * @param {?} imageUrl
         * @param {?} canvasId
         * @return {?}
         */
        NgOpenCVService.prototype.loadImageToCanvas = /**
         * @param {?} imageUrl
         * @param {?} canvasId
         * @return {?}
         */
            function (imageUrl, canvasId) {
                return rxjs.Observable.create(function (observer) {
                    /** @type {?} */
                    var canvas = /** @type {?} */ (document.getElementById(canvasId));
                    /** @type {?} */
                    var ctx = canvas.getContext('2d');
                    /** @type {?} */
                    var img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = function () {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                        observer.next();
                        observer.complete();
                    };
                    img.src = imageUrl;
                });
            };
        /**
         * @param {?} imageUrl
         * @param {?} canvas
         * @return {?}
         */
        NgOpenCVService.prototype.loadImageToHTMLCanvas = /**
         * @param {?} imageUrl
         * @param {?} canvas
         * @return {?}
         */
            function (imageUrl, canvas) {
                return rxjs.Observable.create(function (observer) {
                    /** @type {?} */
                    var ctx = canvas.getContext('2d');
                    /** @type {?} */
                    var img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = function () {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                        observer.next();
                        observer.complete();
                    };
                    img.src = imageUrl;
                });
            };
        /**
         * @return {?}
         */
        NgOpenCVService.prototype.clearError = /**
         * @return {?}
         */
            function () {
                this.errorOutput.innerHTML = '';
            };
        /**
         * @param {?} err
         * @return {?}
         */
        NgOpenCVService.prototype.printError = /**
         * @param {?} err
         * @return {?}
         */
            function (err) {
                if (typeof err === 'undefined') {
                    err = '';
                }
                else if (typeof err === 'number') {
                    if (!isNaN(err)) {
                        if (typeof cv !== 'undefined') {
                            err = 'Exception: ' + cv.exceptionFromPtr(err).msg;
                        }
                    }
                }
                else if (typeof err === 'string') {
                    /** @type {?} */
                    var ptr = Number(err.split(' ')[0]);
                    if (!isNaN(ptr)) {
                        if (typeof cv !== 'undefined') {
                            err = 'Exception: ' + cv.exceptionFromPtr(ptr).msg;
                        }
                    }
                }
                else if (err instanceof Error) {
                    err = err.stack.replace(/\n/g, '<br>');
                }
                throw new Error(err);
            };
        /**
         * @param {?} scriptId
         * @param {?} textAreaId
         * @return {?}
         */
        NgOpenCVService.prototype.loadCode = /**
         * @param {?} scriptId
         * @param {?} textAreaId
         * @return {?}
         */
            function (scriptId, textAreaId) {
                /** @type {?} */
                var scriptNode = /** @type {?} */ (document.getElementById(scriptId));
                /** @type {?} */
                var textArea = /** @type {?} */ (document.getElementById(textAreaId));
                if (scriptNode.type !== 'text/code-snippet') {
                    throw Error('Unknown code snippet type');
                }
                textArea.value = scriptNode.text.replace(/^\n/, '');
            };
        /**
         * @param {?} fileInputId
         * @param {?} canvasId
         * @return {?}
         */
        NgOpenCVService.prototype.addFileInputHandler = /**
         * @param {?} fileInputId
         * @param {?} canvasId
         * @return {?}
         */
            function (fileInputId, canvasId) {
                var _this = this;
                /** @type {?} */
                var inputElement = document.getElementById(fileInputId);
                inputElement.addEventListener('change', function (e) {
                    /** @type {?} */
                    var files = e.target['files'];
                    if (files.length > 0) {
                        /** @type {?} */
                        var imgUrl = URL.createObjectURL(files[0]);
                        _this.loadImageToCanvas(imgUrl, canvasId);
                    }
                }, false);
            };
        /**
         * @return {?}
         */
        NgOpenCVService.prototype.onVideoCanPlay = /**
         * @return {?}
         */
            function () {
                if (this.onCameraStartedCallback) {
                    this.onCameraStartedCallback(this.stream, this.video);
                }
            };
        /**
         * @param {?} resolution
         * @param {?} callback
         * @param {?} videoId
         * @return {?}
         */
        NgOpenCVService.prototype.startCamera = /**
         * @param {?} resolution
         * @param {?} callback
         * @param {?} videoId
         * @return {?}
         */
            function (resolution, callback, videoId) {
                var _this = this;
                /** @type {?} */
                var constraints = {
                    qvga: { width: { exact: 320 }, height: { exact: 240 } },
                    vga: { width: { exact: 640 }, height: { exact: 480 } }
                };
                /** @type {?} */
                var video = /** @type {?} */ (document.getElementById(videoId));
                if (!video) {
                    video = document.createElement('video');
                }
                /** @type {?} */
                var videoConstraint = constraints[resolution];
                if (!videoConstraint) {
                    videoConstraint = true;
                }
                navigator.mediaDevices
                    .getUserMedia({ video: videoConstraint, audio: false })
                    .then(function (stream) {
                    video.srcObject = stream;
                    video.play();
                    _this.video = video;
                    _this.stream = stream;
                    _this.onCameraStartedCallback = callback;
                    video.addEventListener('canplay', _this.onVideoCanPlay.bind(_this), false);
                })
                    .catch(function (err) {
                    _this.printError('Camera Error: ' + err.name + ' ' + err.message);
                });
            };
        /**
         * @return {?}
         */
        NgOpenCVService.prototype.stopCamera = /**
         * @return {?}
         */
            function () {
                if (this.video) {
                    this.video.pause();
                    this.video.srcObject = null;
                    this.video.removeEventListener('canplay', this.onVideoCanPlay.bind(this));
                }
                if (this.stream) {
                    this.stream.getVideoTracks()[0].stop();
                }
            };
        /**
         * @param {?} src
         * @param {?} width
         * @param {?} height
         * @return {?}
         */
        NgOpenCVService.prototype.getContours = /**
         * @param {?} src
         * @param {?} width
         * @param {?} height
         * @return {?}
         */
            function (src, width, height) {
                cv.cvtColor(src, this.dstC1, cv.COLOR_RGBA2GRAY);
                cv.threshold(this.dstC1, this.dstC4, 120, 200, cv.THRESH_BINARY);
                /** @type {?} */
                var contours = new cv.MatVector();
                /** @type {?} */
                var hierarchy = new cv.Mat();
                cv.findContours(this.dstC4, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE, {
                    x: 0,
                    y: 0
                });
                this.dstC3.delete();
                this.dstC3 = cv.Mat.ones(height, width, cv.CV_8UC3);
                for (var i = 0; i < contours.size(); ++i) {
                    /** @type {?} */
                    var color = new cv.Scalar(0, 255, 0);
                    cv.drawContours(this.dstC3, contours, i, color, 1, cv.LINE_8, hierarchy);
                }
                contours.delete();
                hierarchy.delete();
                return this.dstC3;
            };
        NgOpenCVService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        NgOpenCVService.ctorParameters = function () {
            return [
                { type: undefined, decorators: [{ type: i0.Inject, args: [OPEN_CV_CONFIGURATION,] }] }
            ];
        };
        /** @nocollapse */ NgOpenCVService.ngInjectableDef = i0.defineInjectable({ factory: function NgOpenCVService_Factory() { return new NgOpenCVService(i0.inject(OPEN_CV_CONFIGURATION)); }, token: NgOpenCVService, providedIn: "root" });
        return NgOpenCVService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
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
            { type: i0.NgModule, args: [{
                        imports: [],
                        declarations: [],
                        exports: [],
                        providers: [NgOpenCVService]
                    },] }
        ];
        return NgOpenCVModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.OPEN_CV_CONFIGURATION = OPEN_CV_CONFIGURATION;
    exports.NgOpenCVService = NgOpenCVService;
    exports.NgOpenCVModule = NgOpenCVModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctb3Blbi1jdi51bWQuanMubWFwIiwic291cmNlcyI6WyJub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwibmc6Ly9uZy1vcGVuLWN2L2xpYi9uZy1vcGVuLWN2LnNlcnZpY2UudHMiLCJuZzovL25nLW9wZW4tY3YvbGliL25nLW9wZW4tY3YubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE9wZW5DVkxvYWRSZXN1bHQsIE9wZW5DVk9wdGlvbnMgfSBmcm9tICcuL25nLW9wZW4tY3YubW9kZWxzJztcblxuLypcbkFuZ3VsYXIgbW9kaWZpZmljYXRpb24gb2YgdGhlIE9wZW5DViB1dGlscyBzY3JpcHQgZm91bmQgYXQgaHR0cHM6Ly9kb2NzLm9wZW5jdi5vcmcvbWFzdGVyL3V0aWxzLmpzXG4qL1xuZGVjbGFyZSB2YXIgY3Y6IGFueTtcblxuZXhwb3J0IGNvbnN0IE9QRU5fQ1ZfQ09ORklHVVJBVElPTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxPcGVuQ1ZPcHRpb25zPignQW5ndWxhciBPcGVuQ1YgQ29uZmlndXJhdGlvbiBPYmplY3QnKTtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmdPcGVuQ1ZTZXJ2aWNlIHtcbiAgZXJyb3JPdXRwdXQ6IEhUTUxFbGVtZW50O1xuICBzcmMgPSBudWxsO1xuICBkc3RDMSA9IG51bGw7XG4gIGRzdEMzID0gbnVsbDtcbiAgZHN0QzQgPSBudWxsO1xuXG4gIHN0cmVhbTogYW55O1xuICB2aWRlbzogYW55O1xuICBwcml2YXRlIGlzUmVhZHkgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PE9wZW5DVkxvYWRSZXN1bHQ+KHtcbiAgICByZWFkeTogZmFsc2UsXG4gICAgZXJyb3I6IGZhbHNlLFxuICAgIGxvYWRpbmc6IHRydWVcbiAgfSk7XG4gIGlzUmVhZHkkOiBPYnNlcnZhYmxlPE9wZW5DVkxvYWRSZXN1bHQ+ID0gdGhpcy5pc1JlYWR5LmFzT2JzZXJ2YWJsZSgpO1xuICBvbkNhbWVyYVN0YXJ0ZWRDYWxsYmFjazogKGEsIGIpID0+IHZvaWQ7XG4gIE9QRU5DVl9VUkwgPSAnb3BlbmN2LmpzJztcbiAgREVGQVVMVF9PUFRJT05TID0ge1xuICAgIHNjcmlwdFVybDogJ2Fzc2V0cy9vcGVuY3YvYXNtLzMuNC9vcGVuY3YuanMnLFxuICAgIHdhc21CaW5hcnlGaWxlOiAnd2FzbS8zLjQvb3BlbmN2X2pzLndhc20nLFxuICAgIHVzaW5nV2FzbTogZmFsc2UsXG4gICAgbG9jYXRlRmlsZTogdGhpcy5sb2NhdGVGaWxlLmJpbmQodGhpcyksXG4gICAgb25SdW50aW1lSW5pdGlhbGl6ZWQ6ICgpID0+IHt9XG4gIH07XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChPUEVOX0NWX0NPTkZJR1VSQVRJT04pIG9wdGlvbnM6IE9wZW5DVk9wdGlvbnMpIHtcbiAgICB0aGlzLnNldFNjcmlwdFVybChvcHRpb25zLnNjcmlwdFVybCk7XG4gICAgY29uc3Qgb3B0cyA9IHsgLi4udGhpcy5ERUZBVUxUX09QVElPTlMsIG9wdGlvbnMgfTtcbiAgICB0aGlzLmxvYWRPcGVuQ3Yob3B0cyk7XG4gIH1cblxuICBwcml2YXRlIGxvY2F0ZUZpbGUocGF0aCwgc2NyaXB0RGlyZWN0b3J5KTogc3RyaW5nIHtcbiAgICBpZiAocGF0aCA9PT0gJ29wZW5jdl9qcy53YXNtJykge1xuICAgICAgcmV0dXJuIHNjcmlwdERpcmVjdG9yeSArICcvd2FzbS8nICsgcGF0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNjcmlwdERpcmVjdG9yeSArIHBhdGg7XG4gICAgfVxuICB9XG5cbiAgc2V0U2NyaXB0VXJsKHVybDogc3RyaW5nKSB7XG4gICAgdGhpcy5PUEVOQ1ZfVVJMID0gdXJsO1xuICB9XG5cbiAgbG9hZE9wZW5DdihvcHRpb25zOiBPcGVuQ1ZPcHRpb25zKSB7XG4gICAgdGhpcy5pc1JlYWR5Lm5leHQoe1xuICAgICAgcmVhZHk6IGZhbHNlLFxuICAgICAgZXJyb3I6IGZhbHNlLFxuICAgICAgbG9hZGluZzogdHJ1ZVxuICAgIH0pO1xuICAgIHdpbmRvd1snTW9kdWxlJ10gPSB7IC4uLm9wdGlvbnMgfTtcbiAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCdhc3luYycsICcnKTtcbiAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvamF2YXNjcmlwdCcpO1xuICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgaWYgKG9wdGlvbnMub25SdW50aW1lSW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgb3B0aW9ucy5vblJ1bnRpbWVJbml0aWFsaXplZCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5pc1JlYWR5Lm5leHQoe1xuICAgICAgICByZWFkeTogdHJ1ZSxcbiAgICAgICAgZXJyb3I6IGZhbHNlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXJyID0gdGhpcy5wcmludEVycm9yKCdGYWlsZWQgdG8gbG9hZCAnICsgdGhpcy5PUEVOQ1ZfVVJMKTtcbiAgICAgIHRoaXMuaXNSZWFkeS5uZXh0KHtcbiAgICAgICAgcmVhZHk6IGZhbHNlLFxuICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgdGhpcy5pc1JlYWR5LmVycm9yKGVycik7XG4gICAgfSk7XG4gICAgc2NyaXB0LnNyYyA9IHRoaXMuT1BFTkNWX1VSTDtcbiAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgIGlmIChub2RlKSB7XG4gICAgICBub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgbm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVGaWxlRnJvbVVybChwYXRoLCB1cmwpIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgY29uc3QgeyBuZXh0LCBlcnJvcjogY2F0Y2hFcnJvciwgY29tcGxldGUgfSA9IG9ic2VydmVyO1xuICAgICAgcmVxdWVzdC5vbmxvYWQgPSBldiA9PiB7XG4gICAgICAgIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBVaW50OEFycmF5KHJlcXVlc3QucmVzcG9uc2UpO1xuICAgICAgICAgICAgY3YuRlNfY3JlYXRlRGF0YUZpbGUoJy8nLCBwYXRoLCBkYXRhLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCgpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcmludEVycm9yKCdGYWlsZWQgdG8gbG9hZCAnICsgdXJsICsgJyBzdGF0dXM6ICcgKyByZXF1ZXN0LnN0YXR1cyk7XG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgbG9hZEltYWdlVG9DYW52YXMoaW1hZ2VVcmwsIGNhbnZhc0lkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZShvYnNlcnZlciA9PiB7XG4gICAgICBjb25zdCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKTtcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICBpbWcuY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJztcbiAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGltZy5oZWlnaHQ7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBpbWcud2lkdGgsIGltZy5oZWlnaHQpO1xuICAgICAgICBvYnNlcnZlci5uZXh0KCk7XG4gICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICB9O1xuICAgICAgaW1nLnNyYyA9IGltYWdlVXJsO1xuICAgIH0pO1xuICB9XG5cbiAgbG9hZEltYWdlVG9IVE1MQ2FudmFzKGltYWdlVXJsOiBzdHJpbmcsIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZShvYnNlcnZlciA9PiB7XG4gICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1nLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG4gICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBjYW52YXMud2lkdGggPSBpbWcud2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xuICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCgpO1xuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfTtcbiAgICAgIGltZy5zcmMgPSBpbWFnZVVybDtcbiAgICB9KTtcbiAgfVxuXG4gIGNsZWFyRXJyb3IoKSB7XG4gICAgdGhpcy5lcnJvck91dHB1dC5pbm5lckhUTUwgPSAnJztcbiAgfVxuXG4gIHByaW50RXJyb3IoZXJyKSB7XG4gICAgaWYgKHR5cGVvZiBlcnIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBlcnIgPSAnJztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBlcnIgPT09ICdudW1iZXInKSB7XG4gICAgICBpZiAoIWlzTmFOKGVycikpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjdiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBlcnIgPSAnRXhjZXB0aW9uOiAnICsgY3YuZXhjZXB0aW9uRnJvbVB0cihlcnIpLm1zZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVyciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IHB0ciA9IE51bWJlcihlcnIuc3BsaXQoJyAnKVswXSk7XG4gICAgICBpZiAoIWlzTmFOKHB0cikpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjdiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBlcnIgPSAnRXhjZXB0aW9uOiAnICsgY3YuZXhjZXB0aW9uRnJvbVB0cihwdHIpLm1zZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIGVyciA9IGVyci5zdGFjay5yZXBsYWNlKC9cXG4vZywgJzxicj4nKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gIH1cblxuICBsb2FkQ29kZShzY3JpcHRJZCwgdGV4dEFyZWFJZCkge1xuICAgIGNvbnN0IHNjcmlwdE5vZGUgPSA8SFRNTFNjcmlwdEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2NyaXB0SWQpO1xuICAgIGNvbnN0IHRleHRBcmVhID0gPEhUTUxUZXh0QXJlYUVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGV4dEFyZWFJZCk7XG4gICAgaWYgKHNjcmlwdE5vZGUudHlwZSAhPT0gJ3RleHQvY29kZS1zbmlwcGV0Jykge1xuICAgICAgdGhyb3cgRXJyb3IoJ1Vua25vd24gY29kZSBzbmlwcGV0IHR5cGUnKTtcbiAgICB9XG4gICAgdGV4dEFyZWEudmFsdWUgPSBzY3JpcHROb2RlLnRleHQucmVwbGFjZSgvXlxcbi8sICcnKTtcbiAgfVxuXG4gIGFkZEZpbGVJbnB1dEhhbmRsZXIoZmlsZUlucHV0SWQsIGNhbnZhc0lkKSB7XG4gICAgY29uc3QgaW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZmlsZUlucHV0SWQpO1xuICAgIGlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2NoYW5nZScsXG4gICAgICBlID0+IHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBlLnRhcmdldFsnZmlsZXMnXTtcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb25zdCBpbWdVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGVzWzBdKTtcbiAgICAgICAgICB0aGlzLmxvYWRJbWFnZVRvQ2FudmFzKGltZ1VybCwgY2FudmFzSWQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgb25WaWRlb0NhblBsYXkoKSB7XG4gICAgaWYgKHRoaXMub25DYW1lcmFTdGFydGVkQ2FsbGJhY2spIHtcbiAgICAgIHRoaXMub25DYW1lcmFTdGFydGVkQ2FsbGJhY2sodGhpcy5zdHJlYW0sIHRoaXMudmlkZW8pO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0Q2FtZXJhKHJlc29sdXRpb24sIGNhbGxiYWNrLCB2aWRlb0lkKSB7XG4gICAgY29uc3QgY29uc3RyYWludHMgPSB7XG4gICAgICBxdmdhOiB7IHdpZHRoOiB7IGV4YWN0OiAzMjAgfSwgaGVpZ2h0OiB7IGV4YWN0OiAyNDAgfSB9LFxuICAgICAgdmdhOiB7IHdpZHRoOiB7IGV4YWN0OiA2NDAgfSwgaGVpZ2h0OiB7IGV4YWN0OiA0ODAgfSB9XG4gICAgfTtcbiAgICBsZXQgdmlkZW8gPSA8SFRNTFZpZGVvRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2aWRlb0lkKTtcbiAgICBpZiAoIXZpZGVvKSB7XG4gICAgICB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgfVxuXG4gICAgbGV0IHZpZGVvQ29uc3RyYWludCA9IGNvbnN0cmFpbnRzW3Jlc29sdXRpb25dO1xuICAgIGlmICghdmlkZW9Db25zdHJhaW50KSB7XG4gICAgICB2aWRlb0NvbnN0cmFpbnQgPSB0cnVlO1xuICAgIH1cblxuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgIC5nZXRVc2VyTWVkaWEoeyB2aWRlbzogdmlkZW9Db25zdHJhaW50LCBhdWRpbzogZmFsc2UgfSlcbiAgICAgIC50aGVuKHN0cmVhbSA9PiB7XG4gICAgICAgIHZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTtcbiAgICAgICAgdmlkZW8ucGxheSgpO1xuICAgICAgICB0aGlzLnZpZGVvID0gdmlkZW87XG4gICAgICAgIHRoaXMuc3RyZWFtID0gc3RyZWFtO1xuICAgICAgICB0aGlzLm9uQ2FtZXJhU3RhcnRlZENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXknLCB0aGlzLm9uVmlkZW9DYW5QbGF5LmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgdGhpcy5wcmludEVycm9yKCdDYW1lcmEgRXJyb3I6ICcgKyBlcnIubmFtZSArICcgJyArIGVyci5tZXNzYWdlKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgc3RvcENhbWVyYSgpIHtcbiAgICBpZiAodGhpcy52aWRlbykge1xuICAgICAgdGhpcy52aWRlby5wYXVzZSgpO1xuICAgICAgdGhpcy52aWRlby5zcmNPYmplY3QgPSBudWxsO1xuICAgICAgdGhpcy52aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgdGhpcy5vblZpZGVvQ2FuUGxheS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc3RyZWFtKSB7XG4gICAgICB0aGlzLnN0cmVhbS5nZXRWaWRlb1RyYWNrcygpWzBdLnN0b3AoKTtcbiAgICB9XG4gIH1cblxuICBnZXRDb250b3VycyhzcmMsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBjdi5jdnRDb2xvcihzcmMsIHRoaXMuZHN0QzEsIGN2LkNPTE9SX1JHQkEyR1JBWSk7XG4gICAgY3YudGhyZXNob2xkKHRoaXMuZHN0QzEsIHRoaXMuZHN0QzQsIDEyMCwgMjAwLCBjdi5USFJFU0hfQklOQVJZKTtcbiAgICBjb25zdCBjb250b3VycyA9IG5ldyBjdi5NYXRWZWN0b3IoKTtcbiAgICBjb25zdCBoaWVyYXJjaHkgPSBuZXcgY3YuTWF0KCk7XG4gICAgY3YuZmluZENvbnRvdXJzKHRoaXMuZHN0QzQsIGNvbnRvdXJzLCBoaWVyYXJjaHksIGN2LlJFVFJfQ0NPTVAsIGN2LkNIQUlOX0FQUFJPWF9TSU1QTEUsIHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfSk7XG4gICAgdGhpcy5kc3RDMy5kZWxldGUoKTtcbiAgICB0aGlzLmRzdEMzID0gY3YuTWF0Lm9uZXMoaGVpZ2h0LCB3aWR0aCwgY3YuQ1ZfOFVDMyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250b3Vycy5zaXplKCk7ICsraSkge1xuICAgICAgY29uc3QgY29sb3IgPSBuZXcgY3YuU2NhbGFyKDAsIDI1NSwgMCk7XG4gICAgICBjdi5kcmF3Q29udG91cnModGhpcy5kc3RDMywgY29udG91cnMsIGksIGNvbG9yLCAxLCBjdi5MSU5FXzgsIGhpZXJhcmNoeSk7XG4gICAgfVxuICAgIGNvbnRvdXJzLmRlbGV0ZSgpO1xuICAgIGhpZXJhcmNoeS5kZWxldGUoKTtcbiAgICByZXR1cm4gdGhpcy5kc3RDMztcbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nT3BlbkNWU2VydmljZSwgT1BFTl9DVl9DT05GSUdVUkFUSU9OIH0gZnJvbSAnLi9uZy1vcGVuLWN2LnNlcnZpY2UnO1xuaW1wb3J0IHsgT3BlbkNWT3B0aW9ucyB9IGZyb20gJy4vbmctb3Blbi1jdi5tb2RlbHMnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXSxcbiAgZGVjbGFyYXRpb25zOiBbXSxcbiAgZXhwb3J0czogW10sXG4gIHByb3ZpZGVyczogW05nT3BlbkNWU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgTmdPcGVuQ1ZNb2R1bGUge1xuICAvKipcbiAgICpcbiAgICogU2V0dXAgdGhlIG1vZHVsZSBpbiB5b3VyIGFwcGxpY2F0aW9uJ3Mgcm9vdCBib290c3RyYXAuXG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBOZ09wZW5Ddk1vZHVsZVxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoY29uZmlnOiBPcGVuQ1ZPcHRpb25zKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBOZ09wZW5DVk1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogT1BFTl9DVl9DT05GSUdVUkFUSU9OLCB1c2VWYWx1ZTogY29uZmlnIH1dXG4gICAgfTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIkluamVjdGlvblRva2VuIiwiQmVoYXZpb3JTdWJqZWN0IiwiT2JzZXJ2YWJsZSIsIkluamVjdGFibGUiLCJJbmplY3QiLCJOZ01vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQUE7Ozs7Ozs7Ozs7Ozs7O0FBY0EsSUFlTyxJQUFJLFFBQVEsR0FBRztRQUNsQixRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQztZQUMzQyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDakQsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoRjtZQUNELE9BQU8sQ0FBQyxDQUFDO1NBQ1osQ0FBQTtRQUNELE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFBOzs7Ozs7O0FDNUJELFFBQWEscUJBQXFCLEdBQUcsSUFBSUEsaUJBQWMsQ0FBZ0IscUNBQXFDLENBQUMsQ0FBQzs7UUE4QjVHLHlCQUEyQyxPQUFzQjt1QkF2QjNELElBQUk7eUJBQ0YsSUFBSTt5QkFDSixJQUFJO3lCQUNKLElBQUk7MkJBSU0sSUFBSUMsb0JBQWUsQ0FBbUI7Z0JBQ3RELEtBQUssRUFBRSxLQUFLO2dCQUNaLEtBQUssRUFBRSxLQUFLO2dCQUNaLE9BQU8sRUFBRSxJQUFJO2FBQ2QsQ0FBQzs0QkFDdUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7OEJBRXZELFdBQVc7bUNBQ047Z0JBQ2hCLFNBQVMsRUFBRSxpQ0FBaUM7Z0JBQzVDLGNBQWMsRUFBRSx5QkFBeUI7Z0JBQ3pDLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUN0QyxvQkFBb0IsRUFBRSxlQUFRO2FBQy9CO1lBR0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O1lBQ3JDLElBQU0sSUFBSSxnQkFBUSxJQUFJLENBQUMsZUFBZSxJQUFFLE9BQU8sU0FBQSxJQUFHO1lBQ2xELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkI7Ozs7OztRQUVPLG9DQUFVOzs7OztzQkFBQyxJQUFJLEVBQUUsZUFBZTtnQkFDdEMsSUFBSSxJQUFJLEtBQUssZ0JBQWdCLEVBQUU7b0JBQzdCLE9BQU8sZUFBZSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUM7aUJBQzFDO3FCQUFNO29CQUNMLE9BQU8sZUFBZSxHQUFHLElBQUksQ0FBQztpQkFDL0I7Ozs7OztRQUdILHNDQUFZOzs7O1lBQVosVUFBYSxHQUFXO2dCQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQzthQUN2Qjs7Ozs7UUFFRCxvQ0FBVTs7OztZQUFWLFVBQVcsT0FBc0I7Z0JBQWpDLGlCQW9DQztnQkFuQ0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7b0JBQ2hCLEtBQUssRUFBRSxLQUFLO29CQUNaLEtBQUssRUFBRSxLQUFLO29CQUNaLE9BQU8sRUFBRSxJQUFJO2lCQUNkLENBQUMsQ0FBQztnQkFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFRLE9BQU8sQ0FBRSxDQUFDOztnQkFDbEMsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEQsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUM7Z0JBQy9DLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7b0JBQzlCLElBQUksT0FBTyxDQUFDLG9CQUFvQixFQUFFO3dCQUNoQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztxQkFDaEM7b0JBQ0QsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7d0JBQ2hCLEtBQUssRUFBRSxJQUFJO3dCQUNYLEtBQUssRUFBRSxLQUFLO3dCQUNaLE9BQU8sRUFBRSxLQUFLO3FCQUNmLENBQUMsQ0FBQztpQkFDSixDQUFDLENBQUM7Z0JBQ0gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRTs7b0JBQy9CLElBQU0sR0FBRyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNqRSxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQzt3QkFDaEIsS0FBSyxFQUFFLEtBQUs7d0JBQ1osS0FBSyxFQUFFLElBQUk7d0JBQ1gsT0FBTyxFQUFFLEtBQUs7cUJBQ2YsQ0FBQyxDQUFDO29CQUNILEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN6QixDQUFDLENBQUM7Z0JBQ0gsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDOztnQkFDN0IsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxJQUFJLElBQUksRUFBRTtvQkFDUixJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQzVDO3FCQUFNO29CQUNMLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUNuQzthQUNGOzs7Ozs7UUFFRCwyQ0FBaUI7Ozs7O1lBQWpCLFVBQWtCLElBQUksRUFBRSxHQUFHO2dCQUEzQixpQkFxQkM7O2dCQXBCQyxJQUFNLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO2dCQUNyQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQy9CLE9BQU8sQ0FBQyxZQUFZLEdBQUcsYUFBYSxDQUFDO2dCQUNyQyxPQUFPLElBQUlDLGVBQVUsQ0FBQyxVQUFBLFFBQVE7b0JBQ3BCLElBQUEsb0JBQUksRUFBRSwyQkFBaUIsRUFBRSw0QkFBUSxDQUFjO29CQUN2RCxPQUFPLENBQUMsTUFBTSxHQUFHLFVBQUEsRUFBRTt3QkFDakIsSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBRTs0QkFDNUIsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTs7Z0NBQzFCLElBQU0sSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQ0FDOUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0NBQzFELFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQ0FDaEIsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDOzZCQUNyQjtpQ0FBTTtnQ0FDTCxLQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixHQUFHLEdBQUcsR0FBRyxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dDQUN4RSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7NkJBQ2xCO3lCQUNGO3FCQUNGLENBQUM7b0JBQ0YsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNoQixDQUFDLENBQUM7YUFDSjs7Ozs7O1FBRUQsMkNBQWlCOzs7OztZQUFqQixVQUFrQixRQUFRLEVBQUUsUUFBZ0I7Z0JBQzFDLE9BQU9BLGVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQSxRQUFROztvQkFDL0IsSUFBTSxNQUFNLHFCQUF5QyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFDOztvQkFDdkYsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7b0JBQ3BDLElBQU0sR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7b0JBQ3hCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUM5QixHQUFHLENBQUMsTUFBTSxHQUFHO3dCQUNYLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQzt3QkFDekIsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO3dCQUMzQixHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNoRCxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ2hCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztxQkFDckIsQ0FBQztvQkFDRixHQUFHLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztpQkFDcEIsQ0FBQyxDQUFDO2FBQ0o7Ozs7OztRQUVELCtDQUFxQjs7Ozs7WUFBckIsVUFBc0IsUUFBZ0IsRUFBRSxNQUF5QjtnQkFDL0QsT0FBT0EsZUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFBLFFBQVE7O29CQUMvQixJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztvQkFDcEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztvQkFDeEIsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0JBQzlCLEdBQUcsQ0FBQyxNQUFNLEdBQUc7d0JBQ1gsTUFBTSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO3dCQUN6QixNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7d0JBQzNCLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ2hELFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDaEIsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO3FCQUNyQixDQUFDO29CQUNGLEdBQUcsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDO2lCQUNwQixDQUFDLENBQUM7YUFDSjs7OztRQUVELG9DQUFVOzs7WUFBVjtnQkFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7YUFDakM7Ozs7O1FBRUQsb0NBQVU7Ozs7WUFBVixVQUFXLEdBQUc7Z0JBQ1osSUFBSSxPQUFPLEdBQUcsS0FBSyxXQUFXLEVBQUU7b0JBQzlCLEdBQUcsR0FBRyxFQUFFLENBQUM7aUJBQ1Y7cUJBQU0sSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7b0JBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQ2YsSUFBSSxPQUFPLEVBQUUsS0FBSyxXQUFXLEVBQUU7NEJBQzdCLEdBQUcsR0FBRyxhQUFhLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQzt5QkFDcEQ7cUJBQ0Y7aUJBQ0Y7cUJBQU0sSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7O29CQUNsQyxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUNmLElBQUksT0FBTyxFQUFFLEtBQUssV0FBVyxFQUFFOzRCQUM3QixHQUFHLEdBQUcsYUFBYSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7eUJBQ3BEO3FCQUNGO2lCQUNGO3FCQUFNLElBQUksR0FBRyxZQUFZLEtBQUssRUFBRTtvQkFDL0IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztpQkFDeEM7Z0JBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN0Qjs7Ozs7O1FBRUQsa0NBQVE7Ozs7O1lBQVIsVUFBUyxRQUFRLEVBQUUsVUFBVTs7Z0JBQzNCLElBQU0sVUFBVSxxQkFBc0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBQzs7Z0JBQ3hFLElBQU0sUUFBUSxxQkFBd0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsRUFBQztnQkFDMUUsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLG1CQUFtQixFQUFFO29CQUMzQyxNQUFNLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO2lCQUMxQztnQkFDRCxRQUFRLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNyRDs7Ozs7O1FBRUQsNkNBQW1COzs7OztZQUFuQixVQUFvQixXQUFXLEVBQUUsUUFBUTtnQkFBekMsaUJBYUM7O2dCQVpDLElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzFELFlBQVksQ0FBQyxnQkFBZ0IsQ0FDM0IsUUFBUSxFQUNSLFVBQUEsQ0FBQzs7b0JBQ0MsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7d0JBQ3BCLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdDLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQzFDO2lCQUNGLEVBQ0QsS0FBSyxDQUNOLENBQUM7YUFDSDs7OztRQUVELHdDQUFjOzs7WUFBZDtnQkFDRSxJQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtvQkFDaEMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUN2RDthQUNGOzs7Ozs7O1FBRUQscUNBQVc7Ozs7OztZQUFYLFVBQVksVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPO2dCQUF6QyxpQkE0QkM7O2dCQTNCQyxJQUFNLFdBQVcsR0FBRztvQkFDbEIsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTtvQkFDdkQsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTtpQkFDdkQsQ0FBQzs7Z0JBQ0YsSUFBSSxLQUFLLHFCQUFxQixRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFDO2dCQUMvRCxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUNWLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUN6Qzs7Z0JBRUQsSUFBSSxlQUFlLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsZUFBZSxFQUFFO29CQUNwQixlQUFlLEdBQUcsSUFBSSxDQUFDO2lCQUN4QjtnQkFFRCxTQUFTLENBQUMsWUFBWTtxQkFDbkIsWUFBWSxDQUFDLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUM7cUJBQ3RELElBQUksQ0FBQyxVQUFBLE1BQU07b0JBQ1YsS0FBSyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7b0JBQ3pCLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDYixLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDbkIsS0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7b0JBQ3JCLEtBQUksQ0FBQyx1QkFBdUIsR0FBRyxRQUFRLENBQUM7b0JBQ3hDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQzFFLENBQUM7cUJBQ0QsS0FBSyxDQUFDLFVBQUEsR0FBRztvQkFDUixLQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDbEUsQ0FBQyxDQUFDO2FBQ047Ozs7UUFFRCxvQ0FBVTs7O1lBQVY7Z0JBQ0UsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDM0U7Z0JBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ3hDO2FBQ0Y7Ozs7Ozs7UUFFRCxxQ0FBVzs7Ozs7O1lBQVgsVUFBWSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU07Z0JBQzVCLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUNqRCxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7Z0JBQ2pFLElBQU0sUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDOztnQkFDcEMsSUFBTSxTQUFTLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLG1CQUFtQixFQUFFO29CQUN0RixDQUFDLEVBQUUsQ0FBQztvQkFDSixDQUFDLEVBQUUsQ0FBQztpQkFDTCxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDcEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTs7b0JBQ3hDLElBQU0sS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7aUJBQzFFO2dCQUNELFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbEIsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNuQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDbkI7O29CQS9QRkMsYUFBVSxTQUFDO3dCQUNWLFVBQVUsRUFBRSxNQUFNO3FCQUNuQjs7Ozs7d0RBMEJjQyxTQUFNLFNBQUMscUJBQXFCOzs7OzhCQXhDM0M7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWtCUyxzQkFBTzs7Ozs7Ozs7O1lBQWQsVUFBZSxNQUFxQjtnQkFDbEMsT0FBTztvQkFDTCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDO2lCQUNsRSxDQUFDO2FBQ0g7O29CQW5CRkMsV0FBUSxTQUFDO3dCQUNSLE9BQU8sRUFBRSxFQUFFO3dCQUNYLFlBQVksRUFBRSxFQUFFO3dCQUNoQixPQUFPLEVBQUUsRUFBRTt3QkFDWCxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUM7cUJBQzdCOzs2QkFURDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==