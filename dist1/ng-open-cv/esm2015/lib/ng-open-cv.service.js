/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as i0 from "@angular/core";
/** @type {?} */
export const OPEN_CV_CONFIGURATION = new InjectionToken('Angular OpenCV Configuration Object');
export class NgOpenCVService {
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
            const { next, error: catchError, complete } = observer;
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
/** @nocollapse */ NgOpenCVService.ngInjectableDef = i0.defineInjectable({ factory: function NgOpenCVService_Factory() { return new NgOpenCVService(i0.inject(OPEN_CV_CONFIGURATION)); }, token: NgOpenCVService, providedIn: "root" });
if (false) {
    /** @type {?} */
    NgOpenCVService.prototype.errorOutput;
    /** @type {?} */
    NgOpenCVService.prototype.src;
    /** @type {?} */
    NgOpenCVService.prototype.dstC1;
    /** @type {?} */
    NgOpenCVService.prototype.dstC3;
    /** @type {?} */
    NgOpenCVService.prototype.dstC4;
    /** @type {?} */
    NgOpenCVService.prototype.stream;
    /** @type {?} */
    NgOpenCVService.prototype.video;
    /** @type {?} */
    NgOpenCVService.prototype.isReady;
    /** @type {?} */
    NgOpenCVService.prototype.isReady$;
    /** @type {?} */
    NgOpenCVService.prototype.onCameraStartedCallback;
    /** @type {?} */
    NgOpenCVService.prototype.OPENCV_URL;
    /** @type {?} */
    NgOpenCVService.prototype.DEFAULT_OPTIONS;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctb3Blbi1jdi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctb3Blbi1jdi8iLCJzb3VyY2VzIjpbImxpYi9uZy1vcGVuLWN2LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRSxPQUFPLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7O0FBU25ELGFBQWEscUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQWdCLHFDQUFxQyxDQUFDLENBQUM7QUFLOUcsTUFBTTs7OztJQXlCSixZQUEyQyxPQUFzQjttQkF2QjNELElBQUk7cUJBQ0YsSUFBSTtxQkFDSixJQUFJO3FCQUNKLElBQUk7dUJBSU0sSUFBSSxlQUFlLENBQW1CO1lBQ3RELEtBQUssRUFBRSxLQUFLO1lBQ1osS0FBSyxFQUFFLEtBQUs7WUFDWixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUM7d0JBQ3VDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFOzBCQUV2RCxXQUFXOytCQUNOO1lBQ2hCLFNBQVMsRUFBRSxpQ0FBaUM7WUFDNUMsY0FBYyxFQUFFLHlCQUF5QjtZQUN6QyxTQUFTLEVBQUUsS0FBSztZQUNoQixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3RDLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxJQUFHO1NBQy9CO1FBR0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O1FBQ3JDLE1BQU0sSUFBSSxxQkFBUSxJQUFJLENBQUMsZUFBZSxJQUFFLE9BQU8sSUFBRztRQUNsRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZCOzs7Ozs7SUFFTyxVQUFVLENBQUMsSUFBSSxFQUFFLGVBQWU7UUFDdEMsSUFBSSxJQUFJ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RUFBRSxDQUFDLEVBQUU7O1lBQ3hDLE1BQU0sS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztTQUMxRTtRQUNELFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ25COzs7WUEvUEYsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7OzRDQTBCYyxNQUFNLFNBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE9wZW5DVkxvYWRSZXN1bHQsIE9wZW5DVk9wdGlvbnMgfSBmcm9tICcuL25nLW9wZW4tY3YubW9kZWxzJztcblxuLypcbkFuZ3VsYXIgbW9kaWZpZmljYXRpb24gb2YgdGhlIE9wZW5DViB1dGlscyBzY3JpcHQgZm91bmQgYXQgaHR0cHM6Ly9kb2NzLm9wZW5jdi5vcmcvbWFzdGVyL3V0aWxzLmpzXG4qL1xuZGVjbGFyZSB2YXIgY3Y6IGFueTtcblxuZXhwb3J0IGNvbnN0IE9QRU5fQ1ZfQ09ORklHVVJBVElPTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxPcGVuQ1ZPcHRpb25zPignQW5ndWxhciBPcGVuQ1YgQ29uZmlndXJhdGlvbiBPYmplY3QnKTtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmdPcGVuQ1ZTZXJ2aWNlIHtcbiAgZXJyb3JPdXRwdXQ6IEhUTUxFbGVtZW50O1xuICBzcmMgPSBudWxsO1xuICBkc3RDMSA9IG51bGw7XG4gIGRzdEMzID0gbnVsbDtcbiAgZHN0QzQgPSBudWxsO1xuXG4gIHN0cmVhbTogYW55O1xuICB2aWRlbzogYW55O1xuICBwcml2YXRlIGlzUmVhZHkgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PE9wZW5DVkxvYWRSZXN1bHQ+KHtcbiAgICByZWFkeTogZmFsc2UsXG4gICAgZXJyb3I6IGZhbHNlLFxuICAgIGxvYWRpbmc6IHRydWVcbiAgfSk7XG4gIGlzUmVhZHkkOiBPYnNlcnZhYmxlPE9wZW5DVkxvYWRSZXN1bHQ+ID0gdGhpcy5pc1JlYWR5LmFzT2JzZXJ2YWJsZSgpO1xuICBvbkNhbWVyYVN0YXJ0ZWRDYWxsYmFjazogKGEsIGIpID0+IHZvaWQ7XG4gIE9QRU5DVl9VUkwgPSAnb3BlbmN2LmpzJztcbiAgREVGQVVMVF9PUFRJT05TID0ge1xuICAgIHNjcmlwdFVybDogJ2Fzc2V0cy9vcGVuY3YvYXNtLzMuNC9vcGVuY3YuanMnLFxuICAgIHdhc21CaW5hcnlGaWxlOiAnd2FzbS8zLjQvb3BlbmN2X2pzLndhc20nLFxuICAgIHVzaW5nV2FzbTogZmFsc2UsXG4gICAgbG9jYXRlRmlsZTogdGhpcy5sb2NhdGVGaWxlLmJpbmQodGhpcyksXG4gICAgb25SdW50aW1lSW5pdGlhbGl6ZWQ6ICgpID0+IHt9XG4gIH07XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChPUEVOX0NWX0NPTkZJR1VSQVRJT04pIG9wdGlvbnM6IE9wZW5DVk9wdGlvbnMpIHtcbiAgICB0aGlzLnNldFNjcmlwdFVybChvcHRpb25zLnNjcmlwdFVybCk7XG4gICAgY29uc3Qgb3B0cyA9IHsgLi4udGhpcy5ERUZBVUxUX09QVElPTlMsIG9wdGlvbnMgfTtcbiAgICB0aGlzLmxvYWRPcGVuQ3Yob3B0cyk7XG4gIH1cblxuICBwcml2YXRlIGxvY2F0ZUZpbGUocGF0aCwgc2NyaXB0RGlyZWN0b3J5KTogc3RyaW5nIHtcbiAgICBpZiAocGF0aCA9PT0gJ29wZW5jdl9qcy53YXNtJykge1xuICAgICAgcmV0dXJuIHNjcmlwdERpcmVjdG9yeSArICcvd2FzbS8nICsgcGF0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNjcmlwdERpcmVjdG9yeSArIHBhdGg7XG4gICAgfVxuICB9XG5cbiAgc2V0U2NyaXB0VXJsKHVybDogc3RyaW5nKSB7XG4gICAgdGhpcy5PUEVOQ1ZfVVJMID0gdXJsO1xuICB9XG5cbiAgbG9hZE9wZW5DdihvcHRpb25zOiBPcGVuQ1ZPcHRpb25zKSB7XG4gICAgdGhpcy5pc1JlYWR5Lm5leHQoe1xuICAgICAgcmVhZHk6IGZhbHNlLFxuICAgICAgZXJyb3I6IGZhbHNlLFxuICAgICAgbG9hZGluZzogdHJ1ZVxuICAgIH0pO1xuICAgIHdpbmRvd1snTW9kdWxlJ10gPSB7IC4uLm9wdGlvbnMgfTtcbiAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCdhc3luYycsICcnKTtcbiAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvamF2YXNjcmlwdCcpO1xuICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgaWYgKG9wdGlvbnMub25SdW50aW1lSW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgb3B0aW9ucy5vblJ1bnRpbWVJbml0aWFsaXplZCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5pc1JlYWR5Lm5leHQoe1xuICAgICAgICByZWFkeTogdHJ1ZSxcbiAgICAgICAgZXJyb3I6IGZhbHNlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXJyID0gdGhpcy5wcmludEVycm9yKCdGYWlsZWQgdG8gbG9hZCAnICsgdGhpcy5PUEVOQ1ZfVVJMKTtcbiAgICAgIHRoaXMuaXNSZWFkeS5uZXh0KHtcbiAgICAgICAgcmVhZHk6IGZhbHNlLFxuICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgdGhpcy5pc1JlYWR5LmVycm9yKGVycik7XG4gICAgfSk7XG4gICAgc2NyaXB0LnNyYyA9IHRoaXMuT1BFTkNWX1VSTDtcbiAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgIGlmIChub2RlKSB7XG4gICAgICBub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgbm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVGaWxlRnJvbVVybChwYXRoLCB1cmwpIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgY29uc3QgeyBuZXh0LCBlcnJvcjogY2F0Y2hFcnJvciwgY29tcGxldGUgfSA9IG9ic2VydmVyO1xuICAgICAgcmVxdWVzdC5vbmxvYWQgPSBldiA9PiB7XG4gICAgICAgIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBVaW50OEFycmF5KHJlcXVlc3QucmVzcG9uc2UpO1xuICAgICAgICAgICAgY3YuRlNfY3JlYXRlRGF0YUZpbGUoJy8nLCBwYXRoLCBkYXRhLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCgpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcmludEVycm9yKCdGYWlsZWQgdG8gbG9hZCAnICsgdXJsICsgJyBzdGF0dXM6ICcgKyByZXF1ZXN0LnN0YXR1cyk7XG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgbG9hZEltYWdlVG9DYW52YXMoaW1hZ2VVcmwsIGNhbnZhc0lkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZShvYnNlcnZlciA9PiB7XG4gICAgICBjb25zdCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKTtcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICBpbWcuY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJztcbiAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGltZy5oZWlnaHQ7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBpbWcud2lkdGgsIGltZy5oZWlnaHQpO1xuICAgICAgICBvYnNlcnZlci5uZXh0KCk7XG4gICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICB9O1xuICAgICAgaW1nLnNyYyA9IGltYWdlVXJsO1xuICAgIH0pO1xuICB9XG5cbiAgbG9hZEltYWdlVG9IVE1MQ2FudmFzKGltYWdlVXJsOiBzdHJpbmcsIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZShvYnNlcnZlciA9PiB7XG4gICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1nLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG4gICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBjYW52YXMud2lkdGggPSBpbWcud2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xuICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCgpO1xuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfTtcbiAgICAgIGltZy5zcmMgPSBpbWFnZVVybDtcbiAgICB9KTtcbiAgfVxuXG4gIGNsZWFyRXJyb3IoKSB7XG4gICAgdGhpcy5lcnJvck91dHB1dC5pbm5lckhUTUwgPSAnJztcbiAgfVxuXG4gIHByaW50RXJyb3IoZXJyKSB7XG4gICAgaWYgKHR5cGVvZiBlcnIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBlcnIgPSAnJztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBlcnIgPT09ICdudW1iZXInKSB7XG4gICAgICBpZiAoIWlzTmFOKGVycikpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjdiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBlcnIgPSAnRXhjZXB0aW9uOiAnICsgY3YuZXhjZXB0aW9uRnJvbVB0cihlcnIpLm1zZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVyciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IHB0ciA9IE51bWJlcihlcnIuc3BsaXQoJyAnKVswXSk7XG4gICAgICBpZiAoIWlzTmFOKHB0cikpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjdiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBlcnIgPSAnRXhjZXB0aW9uOiAnICsgY3YuZXhjZXB0aW9uRnJvbVB0cihwdHIpLm1zZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIGVyciA9IGVyci5zdGFjay5yZXBsYWNlKC9cXG4vZywgJzxicj4nKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gIH1cblxuICBsb2FkQ29kZShzY3JpcHRJZCwgdGV4dEFyZWFJZCkge1xuICAgIGNvbnN0IHNjcmlwdE5vZGUgPSA8SFRNTFNjcmlwdEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2NyaXB0SWQpO1xuICAgIGNvbnN0IHRleHRBcmVhID0gPEhUTUxUZXh0QXJlYUVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGV4dEFyZWFJZCk7XG4gICAgaWYgKHNjcmlwdE5vZGUudHlwZSAhPT0gJ3RleHQvY29kZS1zbmlwcGV0Jykge1xuICAgICAgdGhyb3cgRXJyb3IoJ1Vua25vd24gY29kZSBzbmlwcGV0IHR5cGUnKTtcbiAgICB9XG4gICAgdGV4dEFyZWEudmFsdWUgPSBzY3JpcHROb2RlLnRleHQucmVwbGFjZSgvXlxcbi8sICcnKTtcbiAgfVxuXG4gIGFkZEZpbGVJbnB1dEhhbmRsZXIoZmlsZUlucHV0SWQsIGNhbnZhc0lkKSB7XG4gICAgY29uc3QgaW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZmlsZUlucHV0SWQpO1xuICAgIGlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2NoYW5nZScsXG4gICAgICBlID0+IHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBlLnRhcmdldFsnZmlsZXMnXTtcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb25zdCBpbWdVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGVzWzBdKTtcbiAgICAgICAgICB0aGlzLmxvYWRJbWFnZVRvQ2FudmFzKGltZ1VybCwgY2FudmFzSWQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgb25WaWRlb0NhblBsYXkoKSB7XG4gICAgaWYgKHRoaXMub25DYW1lcmFTdGFydGVkQ2FsbGJhY2spIHtcbiAgICAgIHRoaXMub25DYW1lcmFTdGFydGVkQ2FsbGJhY2sodGhpcy5zdHJlYW0sIHRoaXMudmlkZW8pO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0Q2FtZXJhKHJlc29sdXRpb24sIGNhbGxiYWNrLCB2aWRlb0lkKSB7XG4gICAgY29uc3QgY29uc3RyYWludHMgPSB7XG4gICAgICBxdmdhOiB7IHdpZHRoOiB7IGV4YWN0OiAzMjAgfSwgaGVpZ2h0OiB7IGV4YWN0OiAyNDAgfSB9LFxuICAgICAgdmdhOiB7IHdpZHRoOiB7IGV4YWN0OiA2NDAgfSwgaGVpZ2h0OiB7IGV4YWN0OiA0ODAgfSB9XG4gICAgfTtcbiAgICBsZXQgdmlkZW8gPSA8SFRNTFZpZGVvRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2aWRlb0lkKTtcbiAgICBpZiAoIXZpZGVvKSB7XG4gICAgICB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgfVxuXG4gICAgbGV0IHZpZGVvQ29uc3RyYWludCA9IGNvbnN0cmFpbnRzW3Jlc29sdXRpb25dO1xuICAgIGlmICghdmlkZW9Db25zdHJhaW50KSB7XG4gICAgICB2aWRlb0NvbnN0cmFpbnQgPSB0cnVlO1xuICAgIH1cblxuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgIC5nZXRVc2VyTWVkaWEoeyB2aWRlbzogdmlkZW9Db25zdHJhaW50LCBhdWRpbzogZmFsc2UgfSlcbiAgICAgIC50aGVuKHN0cmVhbSA9PiB7XG4gICAgICAgIHZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTtcbiAgICAgICAgdmlkZW8ucGxheSgpO1xuICAgICAgICB0aGlzLnZpZGVvID0gdmlkZW87XG4gICAgICAgIHRoaXMuc3RyZWFtID0gc3RyZWFtO1xuICAgICAgICB0aGlzLm9uQ2FtZXJhU3RhcnRlZENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXknLCB0aGlzLm9uVmlkZW9DYW5QbGF5LmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgdGhpcy5wcmludEVycm9yKCdDYW1lcmEgRXJyb3I6ICcgKyBlcnIubmFtZSArICcgJyArIGVyci5tZXNzYWdlKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgc3RvcENhbWVyYSgpIHtcbiAgICBpZiAodGhpcy52aWRlbykge1xuICAgICAgdGhpcy52aWRlby5wYXVzZSgpO1xuICAgICAgdGhpcy52aWRlby5zcmNPYmplY3QgPSBudWxsO1xuICAgICAgdGhpcy52aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgdGhpcy5vblZpZGVvQ2FuUGxheS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc3RyZWFtKSB7XG4gICAgICB0aGlzLnN0cmVhbS5nZXRWaWRlb1RyYWNrcygpWzBdLnN0b3AoKTtcbiAgICB9XG4gIH1cblxuICBnZXRDb250b3VycyhzcmMsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBjdi5jdnRDb2xvcihzcmMsIHRoaXMuZHN0QzEsIGN2LkNPTE9SX1JHQkEyR1JBWSk7XG4gICAgY3YudGhyZXNob2xkKHRoaXMuZHN0QzEsIHRoaXMuZHN0QzQsIDEyMCwgMjAwLCBjdi5USFJFU0hfQklOQVJZKTtcbiAgICBjb25zdCBjb250b3VycyA9IG5ldyBjdi5NYXRWZWN0b3IoKTtcbiAgICBjb25zdCBoaWVyYXJjaHkgPSBuZXcgY3YuTWF0KCk7XG4gICAgY3YuZmluZENvbnRvdXJzKHRoaXMuZHN0QzQsIGNvbnRvdXJzLCBoaWVyYXJjaHksIGN2LlJFVFJfQ0NPTVAsIGN2LkNIQUlOX0FQUFJPWF9TSU1QTEUsIHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfSk7XG4gICAgdGhpcy5kc3RDMy5kZWxldGUoKTtcbiAgICB0aGlzLmRzdEMzID0gY3YuTWF0Lm9uZXMoaGVpZ2h0LCB3aWR0aCwgY3YuQ1ZfOFVDMyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250b3Vycy5zaXplKCk7ICsraSkge1xuICAgICAgY29uc3QgY29sb3IgPSBuZXcgY3YuU2NhbGFyKDAsIDI1NSwgMCk7XG4gICAgICBjdi5kcmF3Q29udG91cnModGhpcy5kc3RDMywgY29udG91cnMsIGksIGNvbG9yLCAxLCBjdi5MSU5FXzgsIGhpZXJhcmNoeSk7XG4gICAgfVxuICAgIGNvbnRvdXJzLmRlbGV0ZSgpO1xuICAgIGhpZXJhcmNoeS5kZWxldGUoKTtcbiAgICByZXR1cm4gdGhpcy5kc3RDMztcbiAgfVxufVxuIl19