import { Inject, Injectable, InjectionToken, NgModule, defineInjectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const OPEN_CV_CONFIGURATION = new InjectionToken('Angular OpenCV Configuration Object');
class NgOpenCVService {
    /**
     * @param {?} options
     */
    constructor(options) {
        this.src = null;
        this.dstC1 = null;
        this.dstC3 = null;
        this.dstC4 = null;
        this.isReady = new BehaviorSubject({
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
            onRuntimeInitialized: () => { }
        };
        this.setScriptUrl(options.scriptUrl);
        /** @type {?} */
        const opts = Object.assign({}, this.DEFAULT_OPTIONS, { options });
        this.loadOpenCv(opts);
    }
    /**
     * @param {?} path
     * @param {?} scriptDirectory
     * @return {?}
     */
    locateFile(path, scriptDirectory) {
        if (path === 'opencv_js.wasm') {
            return scriptDirectory + '/wasm/' + path;
        }
        else {
            return scriptDirectory + path;
        }
    }
    /**
     * @param {?} url
     * @return {?}
     */
    setScriptUrl(url) {
        this.OPENCV_URL = url;
    }
    /**
     * @param {?} options
     * @return {?}
     */
    loadOpenCv(options) {
        this.isReady.next({
            ready: false,
            error: false,
            loading: true
        });
        window['Module'] = Object.assign({}, options);
        /** @type {?} */
        const script = document.createElement('script');
        script.setAttribute('async', '');
        script.setAttribute('type', 'text/javascript');
        script.addEventListener('load', () => {
            if (options.onRuntimeInitialized) {
                options.onRuntimeInitialized();
            }
            this.isReady.next({
                ready: true,
                error: false,
                loading: false
            });
        });
        script.addEventListener('error', () => {
            /** @type {?} */
            const err = this.printError('Failed to load ' + this.OPENCV_URL);
            this.isReady.next({
                ready: false,
                error: true,
                loading: false
            });
            this.isReady.error(err);
        });
        script.src = this.OPENCV_URL;
        /** @type {?} */
        const node = document.getElementsByTagName('script')[0];
        if (node) {
            node.parentNode.insertBefore(script, node);
        }
        else {
            document.head.appendChild(script);
        }
    }
    /**
     * @param {?} path
     * @param {?} url
     * @return {?}
     */
    createFileFromUrl(path, url) {
        /** @type {?} */
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        return new Observable(observer => {
            request.onload = ev => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        /** @type {?} */
                        const data = new Uint8Array(request.response);
                        cv.FS_createDataFile('/', path, data, true, false, false);
                        observer.next();
                        observer.complete();
                    }
                    else {
                        this.printError('Failed to load ' + url + ' status: ' + request.status);
                        observer.error();
                    }
                }
            };
            request.send();
        });
    }
    /**
     * @param {?} imageUrl
     * @param {?} canvasId
     * @return {?}
     */
    loadImageToCanvas(imageUrl, canvasId) {
        return Observable.create(observer => {
            /** @type {?} */
            const canvas = /** @type {?} */ (document.getElementById(canvasId));
            /** @type {?} */
            const ctx = canvas.getContext('2d');
            /** @type {?} */
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                observer.next();
                observer.complete();
            };
            img.src = imageUrl;
        });
    }
    /**
     * @param {?} imageUrl
     * @param {?} canvas
     * @return {?}
     */
    loadImageToHTMLCanvas(imageUrl, canvas) {
        return Observable.create(observer => {
            /** @type {?} */
            const ctx = canvas.getContext('2d');
            /** @type {?} */
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                observer.next();
                observer.complete();
            };
            img.src = imageUrl;
        });
    }
    /**
     * @return {?}
     */
    clearError() {
        this.errorOutput.innerHTML = '';
    }
    /**
     * @param {?} err
     * @return {?}
     */
    printError(err) {
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
            const ptr = Number(err.split(' ')[0]);
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
    }
    /**
     * @param {?} scriptId
     * @param {?} textAreaId
     * @return {?}
     */
    loadCode(scriptId, textAreaId) {
        /** @type {?} */
        const scriptNode = /** @type {?} */ (document.getElementById(scriptId));
        /** @type {?} */
        const textArea = /** @type {?} */ (document.getElementById(textAreaId));
        if (scriptNode.type !== 'text/code-snippet') {
            throw Error('Unknown code snippet type');
        }
        textArea.value = scriptNode.text.replace(/^\n/, '');
    }
    /**
     * @param {?} fileInputId
     * @param {?} canvasId
     * @return {?}
     */
    addFileInputHandler(fileInputId, canvasId) {
        /** @type {?} */
        const inputElement = document.getElementById(fileInputId);
        inputElement.addEventListener('change', e => {
            /** @type {?} */
            const files = e.target['files'];
            if (files.length > 0) {
                /** @type {?} */
                const imgUrl = URL.createObjectURL(files[0]);
                this.loadImageToCanvas(imgUrl, canvasId);
            }
        }, false);
    }
    /**
     * @return {?}
     */
    onVideoCanPlay() {
        if (this.onCameraStartedCallback) {
            this.onCameraStartedCallback(this.stream, this.video);
        }
    }
    /**
     * @param {?} resolution
     * @param {?} callback
     * @param {?} videoId
     * @return {?}
     */
    startCamera(resolution, callback, videoId) {
        /** @type {?} */
        const constraints = {
            qvga: { width: { exact: 320 }, height: { exact: 240 } },
            vga: { width: { exact: 640 }, height: { exact: 480 } }
        };
        /** @type {?} */
        let video = /** @type {?} */ (document.getElementById(videoId));
        if (!video) {
            video = document.createElement('video');
        }
        /** @type {?} */
        let videoConstraint = constraints[resolution];
        if (!videoConstraint) {
            videoConstraint = true;
        }
        navigator.mediaDevices
            .getUserMedia({ video: videoConstraint, audio: false })
            .then(stream => {
            video.srcObject = stream;
            video.play();
            this.video = video;
            this.stream = stream;
            this.onCameraStartedCallback = callback;
            video.addEventListener('canplay', this.onVideoCanPlay.bind(this), false);
        })
            .catch(err => {
            this.printError('Camera Error: ' + err.name + ' ' + err.message);
        });
    }
    /**
     * @return {?}
     */
    stopCamera() {
        if (this.video) {
            this.video.pause();
            this.video.srcObject = null;
            this.video.removeEventListener('canplay', this.onVideoCanPlay.bind(this));
        }
        if (this.stream) {
            this.stream.getVideoTracks()[0].stop();
        }
    }
    /**
     * @param {?} src
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    getContours(src, width, height) {
        cv.cvtColor(src, this.dstC1, cv.COLOR_RGBA2GRAY);
        cv.threshold(this.dstC1, this.dstC4, 120, 200, cv.THRESH_BINARY);
        /** @type {?} */
        const contours = new cv.MatVector();
        /** @type {?} */
        const hierarchy = new cv.Mat();
        cv.findContours(this.dstC4, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE, {
            x: 0,
            y: 0
        });
        this.dstC3.delete();
        this.dstC3 = cv.Mat.ones(height, width, cv.CV_8UC3);
        for (let i = 0; i < contours.size(); ++i) {
            /** @type {?} */
            const color = new cv.Scalar(0, 255, 0);
            cv.drawContours(this.dstC3, contours, i, color, 1, cv.LINE_8, hierarchy);
        }
        contours.delete();
        hierarchy.delete();
        return this.dstC3;
    }
}
NgOpenCVService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
NgOpenCVService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [OPEN_CV_CONFIGURATION,] }] }
];
/** @nocollapse */ NgOpenCVService.ngInjectableDef = defineInjectable({ factory: function NgOpenCVService_Factory() { return new NgOpenCVService(inject(OPEN_CV_CONFIGURATION)); }, token: NgOpenCVService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgOpenCVModule {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { OPEN_CV_CONFIGURATION, NgOpenCVService, NgOpenCVModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctb3Blbi1jdi5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmctb3Blbi1jdi9saWIvbmctb3Blbi1jdi5zZXJ2aWNlLnRzIiwibmc6Ly9uZy1vcGVuLWN2L2xpYi9uZy1vcGVuLWN2Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgT3BlbkNWTG9hZFJlc3VsdCwgT3BlbkNWT3B0aW9ucyB9IGZyb20gJy4vbmctb3Blbi1jdi5tb2RlbHMnO1xuXG4vKlxuQW5ndWxhciBtb2RpZmlmaWNhdGlvbiBvZiB0aGUgT3BlbkNWIHV0aWxzIHNjcmlwdCBmb3VuZCBhdCBodHRwczovL2RvY3Mub3BlbmN2Lm9yZy9tYXN0ZXIvdXRpbHMuanNcbiovXG5kZWNsYXJlIHZhciBjdjogYW55O1xuXG5leHBvcnQgY29uc3QgT1BFTl9DVl9DT05GSUdVUkFUSU9OID0gbmV3IEluamVjdGlvblRva2VuPE9wZW5DVk9wdGlvbnM+KCdBbmd1bGFyIE9wZW5DViBDb25maWd1cmF0aW9uIE9iamVjdCcpO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ09wZW5DVlNlcnZpY2Uge1xuICBlcnJvck91dHB1dDogSFRNTEVsZW1lbnQ7XG4gIHNyYyA9IG51bGw7XG4gIGRzdEMxID0gbnVsbDtcbiAgZHN0QzMgPSBudWxsO1xuICBkc3RDNCA9IG51bGw7XG5cbiAgc3RyZWFtOiBhbnk7XG4gIHZpZGVvOiBhbnk7XG4gIHByaXZhdGUgaXNSZWFkeSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8T3BlbkNWTG9hZFJlc3VsdD4oe1xuICAgIHJlYWR5OiBmYWxzZSxcbiAgICBlcnJvcjogZmFsc2UsXG4gICAgbG9hZGluZzogdHJ1ZVxuICB9KTtcbiAgaXNSZWFkeSQ6IE9ic2VydmFibGU8T3BlbkNWTG9hZFJlc3VsdD4gPSB0aGlzLmlzUmVhZHkuYXNPYnNlcnZhYmxlKCk7XG4gIG9uQ2FtZXJhU3RhcnRlZENhbGxiYWNrOiAoYSwgYikgPT4gdm9pZDtcbiAgT1BFTkNWX1VSTCA9ICdvcGVuY3YuanMnO1xuICBERUZBVUxUX09QVElPTlMgPSB7XG4gICAgc2NyaXB0VXJsOiAnYXNzZXRzL29wZW5jdi9hc20vMy40L29wZW5jdi5qcycsXG4gICAgd2FzbUJpbmFyeUZpbGU6ICd3YXNtLzMuNC9vcGVuY3ZfanMud2FzbScsXG4gICAgdXNpbmdXYXNtOiBmYWxzZSxcbiAgICBsb2NhdGVGaWxlOiB0aGlzLmxvY2F0ZUZpbGUuYmluZCh0aGlzKSxcbiAgICBvblJ1bnRpbWVJbml0aWFsaXplZDogKCkgPT4ge31cbiAgfTtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KE9QRU5fQ1ZfQ09ORklHVVJBVElPTikgb3B0aW9uczogT3BlbkNWT3B0aW9ucykge1xuICAgIHRoaXMuc2V0U2NyaXB0VXJsKG9wdGlvbnMuc2NyaXB0VXJsKTtcbiAgICBjb25zdCBvcHRzID0geyAuLi50aGlzLkRFRkFVTFRfT1BUSU9OUywgb3B0aW9ucyB9O1xuICAgIHRoaXMubG9hZE9wZW5DdihvcHRzKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9jYXRlRmlsZShwYXRoLCBzY3JpcHREaXJlY3RvcnkpOiBzdHJpbmcge1xuICAgIGlmIChwYXRoID09PSAnb3BlbmN2X2pzLndhc20nKSB7XG4gICAgICByZXR1cm4gc2NyaXB0RGlyZWN0b3J5ICsgJy93YXNtLycgKyBwYXRoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2NyaXB0RGlyZWN0b3J5ICsgcGF0aDtcbiAgICB9XG4gIH1cblxuICBzZXRTY3JpcHRVcmwodXJsOiBzdHJpbmcpIHtcbiAgICB0aGlzLk9QRU5DVl9VUkwgPSB1cmw7XG4gIH1cblxuICBsb2FkT3BlbkN2KG9wdGlvbnM6IE9wZW5DVk9wdGlvbnMpIHtcbiAgICB0aGlzLmlzUmVhZHkubmV4dCh7XG4gICAgICByZWFkeTogZmFsc2UsXG4gICAgICBlcnJvcjogZmFsc2UsXG4gICAgICBsb2FkaW5nOiB0cnVlXG4gICAgfSk7XG4gICAgd2luZG93WydNb2R1bGUnXSA9IHsgLi4ub3B0aW9ucyB9O1xuICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ2FzeW5jJywgJycpO1xuICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9qYXZhc2NyaXB0Jyk7XG4gICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICBpZiAob3B0aW9ucy5vblJ1bnRpbWVJbml0aWFsaXplZCkge1xuICAgICAgICBvcHRpb25zLm9uUnVudGltZUluaXRpYWxpemVkKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmlzUmVhZHkubmV4dCh7XG4gICAgICAgIHJlYWR5OiB0cnVlLFxuICAgICAgICBlcnJvcjogZmFsc2UsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XG4gICAgICBjb25zdCBlcnIgPSB0aGlzLnByaW50RXJyb3IoJ0ZhaWxlZCB0byBsb2FkICcgKyB0aGlzLk9QRU5DVl9VUkwpO1xuICAgICAgdGhpcy5pc1JlYWR5Lm5leHQoe1xuICAgICAgICByZWFkeTogZmFsc2UsXG4gICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICB0aGlzLmlzUmVhZHkuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgICBzY3JpcHQuc3JjID0gdGhpcy5PUEVOQ1ZfVVJMO1xuICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gICAgaWYgKG5vZGUpIHtcbiAgICAgIG5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCBub2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUZpbGVGcm9tVXJsKHBhdGgsIHVybCkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICBjb25zdCB7IG5leHQsIGVycm9yOiBjYXRjaEVycm9yLCBjb21wbGV0ZSB9ID0gb2JzZXJ2ZXI7XG4gICAgICByZXF1ZXN0Lm9ubG9hZCA9IGV2ID0+IHtcbiAgICAgICAgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkocmVxdWVzdC5yZXNwb25zZSk7XG4gICAgICAgICAgICBjdi5GU19jcmVhdGVEYXRhRmlsZSgnLycsIHBhdGgsIGRhdGEsIHRydWUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KCk7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByaW50RXJyb3IoJ0ZhaWxlZCB0byBsb2FkICcgKyB1cmwgKyAnIHN0YXR1czogJyArIHJlcXVlc3Quc3RhdHVzKTtcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgfSk7XG4gIH1cblxuICBsb2FkSW1hZ2VUb0NhbnZhcyhpbWFnZVVybCwgY2FudmFzSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKG9ic2VydmVyID0+IHtcbiAgICAgIGNvbnN0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpO1xuICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGltZy5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgY2FudmFzLndpZHRoID0gaW1nLndpZHRoO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaW1nLmhlaWdodDtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XG4gICAgICAgIG9ic2VydmVyLm5leHQoKTtcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgIH07XG4gICAgICBpbWcuc3JjID0gaW1hZ2VVcmw7XG4gICAgfSk7XG4gIH1cblxuICBsb2FkSW1hZ2VUb0hUTUxDYW52YXMoaW1hZ2VVcmw6IHN0cmluZywgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKG9ic2VydmVyID0+IHtcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICBpbWcuY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJztcbiAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGltZy5oZWlnaHQ7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBpbWcud2lkdGgsIGltZy5oZWlnaHQpO1xuICAgICAgICBvYnNlcnZlci5uZXh0KCk7XG4gICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICB9O1xuICAgICAgaW1nLnNyYyA9IGltYWdlVXJsO1xuICAgIH0pO1xuICB9XG5cbiAgY2xlYXJFcnJvcigpIHtcbiAgICB0aGlzLmVycm9yT3V0cHV0LmlubmVySFRNTCA9ICcnO1xuICB9XG5cbiAgcHJpbnRFcnJvcihlcnIpIHtcbiAgICBpZiAodHlwZW9mIGVyciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGVyciA9ICcnO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVyciA9PT0gJ251bWJlcicpIHtcbiAgICAgIGlmICghaXNOYU4oZXJyKSkge1xuICAgICAgICBpZiAodHlwZW9mIGN2ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGVyciA9ICdFeGNlcHRpb246ICcgKyBjdi5leGNlcHRpb25Gcm9tUHRyKGVycikubXNnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXJyID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgcHRyID0gTnVtYmVyKGVyci5zcGxpdCgnICcpWzBdKTtcbiAgICAgIGlmICghaXNOYU4ocHRyKSkge1xuICAgICAgICBpZiAodHlwZW9mIGN2ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGVyciA9ICdFeGNlcHRpb246ICcgKyBjdi5leGNlcHRpb25Gcm9tUHRyKHB0cikubXNnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlcnIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgZXJyID0gZXJyLnN0YWNrLnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgfVxuXG4gIGxvYWRDb2RlKHNjcmlwdElkLCB0ZXh0QXJlYUlkKSB7XG4gICAgY29uc3Qgc2NyaXB0Tm9kZSA9IDxIVE1MU2NyaXB0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChzY3JpcHRJZCk7XG4gICAgY29uc3QgdGV4dEFyZWEgPSA8SFRNTFRleHRBcmVhRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZXh0QXJlYUlkKTtcbiAgICBpZiAoc2NyaXB0Tm9kZS50eXBlICE9PSAndGV4dC9jb2RlLXNuaXBwZXQnKSB7XG4gICAgICB0aHJvdyBFcnJvcignVW5rbm93biBjb2RlIHNuaXBwZXQgdHlwZScpO1xuICAgIH1cbiAgICB0ZXh0QXJlYS52YWx1ZSA9IHNjcmlwdE5vZGUudGV4dC5yZXBsYWNlKC9eXFxuLywgJycpO1xuICB9XG5cbiAgYWRkRmlsZUlucHV0SGFuZGxlcihmaWxlSW5wdXRJZCwgY2FudmFzSWQpIHtcbiAgICBjb25zdCBpbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmaWxlSW5wdXRJZCk7XG4gICAgaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnY2hhbmdlJyxcbiAgICAgIGUgPT4ge1xuICAgICAgICBjb25zdCBmaWxlcyA9IGUudGFyZ2V0WydmaWxlcyddO1xuICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnN0IGltZ1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZXNbMF0pO1xuICAgICAgICAgIHRoaXMubG9hZEltYWdlVG9DYW52YXMoaW1nVXJsLCBjYW52YXNJZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmYWxzZVxuICAgICk7XG4gIH1cblxuICBvblZpZGVvQ2FuUGxheSgpIHtcbiAgICBpZiAodGhpcy5vbkNhbWVyYVN0YXJ0ZWRDYWxsYmFjaykge1xuICAgICAgdGhpcy5vbkNhbWVyYVN0YXJ0ZWRDYWxsYmFjayh0aGlzLnN0cmVhbSwgdGhpcy52aWRlbyk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnRDYW1lcmEocmVzb2x1dGlvbiwgY2FsbGJhY2ssIHZpZGVvSWQpIHtcbiAgICBjb25zdCBjb25zdHJhaW50cyA9IHtcbiAgICAgIHF2Z2E6IHsgd2lkdGg6IHsgZXhhY3Q6IDMyMCB9LCBoZWlnaHQ6IHsgZXhhY3Q6IDI0MCB9IH0sXG4gICAgICB2Z2E6IHsgd2lkdGg6IHsgZXhhY3Q6IDY0MCB9LCBoZWlnaHQ6IHsgZXhhY3Q6IDQ4MCB9IH1cbiAgICB9O1xuICAgIGxldCB2aWRlbyA9IDxIVE1MVmlkZW9FbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZpZGVvSWQpO1xuICAgIGlmICghdmlkZW8pIHtcbiAgICAgIHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcbiAgICB9XG5cbiAgICBsZXQgdmlkZW9Db25zdHJhaW50ID0gY29uc3RyYWludHNbcmVzb2x1dGlvbl07XG4gICAgaWYgKCF2aWRlb0NvbnN0cmFpbnQpIHtcbiAgICAgIHZpZGVvQ29uc3RyYWludCA9IHRydWU7XG4gICAgfVxuXG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgLmdldFVzZXJNZWRpYSh7IHZpZGVvOiB2aWRlb0NvbnN0cmFpbnQsIGF1ZGlvOiBmYWxzZSB9KVxuICAgICAgLnRoZW4oc3RyZWFtID0+IHtcbiAgICAgICAgdmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgICAgIHRoaXMudmlkZW8gPSB2aWRlbztcbiAgICAgICAgdGhpcy5zdHJlYW0gPSBzdHJlYW07XG4gICAgICAgIHRoaXMub25DYW1lcmFTdGFydGVkQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheScsIHRoaXMub25WaWRlb0NhblBsYXkuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICB0aGlzLnByaW50RXJyb3IoJ0NhbWVyYSBFcnJvcjogJyArIGVyci5uYW1lICsgJyAnICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgfSk7XG4gIH1cblxuICBzdG9wQ2FtZXJhKCkge1xuICAgIGlmICh0aGlzLnZpZGVvKSB7XG4gICAgICB0aGlzLnZpZGVvLnBhdXNlKCk7XG4gICAgICB0aGlzLnZpZGVvLnNyY09iamVjdCA9IG51bGw7XG4gICAgICB0aGlzLnZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NhbnBsYXknLCB0aGlzLm9uVmlkZW9DYW5QbGF5LmJpbmQodGhpcykpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zdHJlYW0pIHtcbiAgICAgIHRoaXMuc3RyZWFtLmdldFZpZGVvVHJhY2tzKClbMF0uc3RvcCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldENvbnRvdXJzKHNyYywgd2lkdGgsIGhlaWdodCkge1xuICAgIGN2LmN2dENvbG9yKHNyYywgdGhpcy5kc3RDMSwgY3YuQ09MT1JfUkdCQTJHUkFZKTtcbiAgICBjdi50aHJlc2hvbGQodGhpcy5kc3RDMSwgdGhpcy5kc3RDNCwgMTIwLCAyMDAsIGN2LlRIUkVTSF9CSU5BUlkpO1xuICAgIGNvbnN0IGNvbnRvdXJzID0gbmV3IGN2Lk1hdFZlY3RvcigpO1xuICAgIGNvbnN0IGhpZXJhcmNoeSA9IG5ldyBjdi5NYXQoKTtcbiAgICBjdi5maW5kQ29udG91cnModGhpcy5kc3RDNCwgY29udG91cnMsIGhpZXJhcmNoeSwgY3YuUkVUUl9DQ09NUCwgY3YuQ0hBSU5fQVBQUk9YX1NJTVBMRSwge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9KTtcbiAgICB0aGlzLmRzdEMzLmRlbGV0ZSgpO1xuICAgIHRoaXMuZHN0QzMgPSBjdi5NYXQub25lcyhoZWlnaHQsIHdpZHRoLCBjdi5DVl84VUMzKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRvdXJzLnNpemUoKTsgKytpKSB7XG4gICAgICBjb25zdCBjb2xvciA9IG5ldyBjdi5TY2FsYXIoMCwgMjU1LCAwKTtcbiAgICAgIGN2LmRyYXdDb250b3Vycyh0aGlzLmRzdEMzLCBjb250b3VycywgaSwgY29sb3IsIDEsIGN2LkxJTkVfOCwgaGllcmFyY2h5KTtcbiAgICB9XG4gICAgY29udG91cnMuZGVsZXRlKCk7XG4gICAgaGllcmFyY2h5LmRlbGV0ZSgpO1xuICAgIHJldHVybiB0aGlzLmRzdEMzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdPcGVuQ1ZTZXJ2aWNlLCBPUEVOX0NWX0NPTkZJR1VSQVRJT04gfSBmcm9tICcuL25nLW9wZW4tY3Yuc2VydmljZSc7XG5pbXBvcnQgeyBPcGVuQ1ZPcHRpb25zIH0gZnJvbSAnLi9uZy1vcGVuLWN2Lm1vZGVscyc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtdLFxuICBkZWNsYXJhdGlvbnM6IFtdLFxuICBleHBvcnRzOiBbXSxcbiAgcHJvdmlkZXJzOiBbTmdPcGVuQ1ZTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBOZ09wZW5DVk1vZHVsZSB7XG4gIC8qKlxuICAgKlxuICAgKiBTZXR1cCB0aGUgbW9kdWxlIGluIHlvdXIgYXBwbGljYXRpb24ncyByb290IGJvb3RzdHJhcC5cbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIE5nT3BlbkN2TW9kdWxlXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IE9wZW5DVk9wdGlvbnMpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IE5nT3BlbkNWTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBPUEVOX0NWX0NPTkZJR1VSQVRJT04sIHVzZVZhbHVlOiBjb25maWcgfV1cbiAgICB9O1xuICB9XG59XG4i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