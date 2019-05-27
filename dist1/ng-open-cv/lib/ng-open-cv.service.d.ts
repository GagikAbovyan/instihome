import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { OpenCVLoadResult, OpenCVOptions } from './ng-open-cv.models';
export declare const OPEN_CV_CONFIGURATION: InjectionToken<OpenCVOptions>;
export declare class NgOpenCVService {
    errorOutput: HTMLElement;
    src: any;
    dstC1: any;
    dstC3: any;
    dstC4: any;
    stream: any;
    video: any;
    private isReady;
    isReady$: Observable<OpenCVLoadResult>;
    onCameraStartedCallback: (a: any, b: any) => void;
    OPENCV_URL: string;
    DEFAULT_OPTIONS: {
        scriptUrl: string;
        wasmBinaryFile: string;
        usingWasm: boolean;
        locateFile: any;
        onRuntimeInitialized: () => void;
    };
    constructor(options: OpenCVOptions);
    private locateFile;
    setScriptUrl(url: string): void;
    loadOpenCv(options: OpenCVOptions): void;
    createFileFromUrl(path: any, url: any): Observable<{}>;
    loadImageToCanvas(imageUrl: any, canvasId: string): Observable<any>;
    loadImageToHTMLCanvas(imageUrl: string, canvas: HTMLCanvasElement): Observable<any>;
    clearError(): void;
    printError(err: any): void;
    loadCode(scriptId: any, textAreaId: any): void;
    addFileInputHandler(fileInputId: any, canvasId: any): void;
    onVideoCanPlay(): void;
    startCamera(resolution: any, callback: any, videoId: any): void;
    stopCamera(): void;
    getContours(src: any, width: any, height: any): any;
}
