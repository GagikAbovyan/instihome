export interface OpenCVLocateFileFn {
    (path: string, scriptDirectory: string): any;
}
export interface OpenCvRuntimeInitializedFn {
    (): any;
}
export interface OpenCVOptions {
    scriptUrl: string;
    wasmBinaryFile?: string;
    usingWasm?: boolean;
    locateFile?: OpenCVLocateFileFn;
    onRuntimeInitialized?: OpenCvRuntimeInitializedFn;
}
export interface OpenCVLoadResult {
    ready: boolean;
    error: boolean;
    loading: boolean;
}
