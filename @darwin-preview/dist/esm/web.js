var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebPlugin } from "@capacitor/core";
export class CameraPreviewWeb extends WebPlugin {
    constructor() {
        super({
            name: "CameraPreview",
            platforms: ["web"],
        });
    }
    start(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield navigator.mediaDevices.getUserMedia({
                    audio: !options.disableAudio,
                    video: true
                }).then((stream) => {
                    // Stop any existing stream so we can request media with different constraints based on user input
                    stream.getTracks().forEach((track) => track.stop());
                }).catch(error => {
                    reject(error);
                });
                const video = document.getElementById("video");
                const parent = document.getElementById(options.parent);
                if (!video) {
                    const videoElement = document.createElement("video");
                    videoElement.id = "video";
                    videoElement.setAttribute("class", options.className || "");
                    // Don't flip video feed if camera is rear facing
                    if (options.position !== 'rear') {
                        videoElement.setAttribute("style", "-webkit-transform: scaleX(-1); transform: scaleX(-1);");
                    }
                    parent.appendChild(videoElement);
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        const constraints = {
                            video: true,
                        };
                        if (options.position === 'rear') {
                            constraints.video = { facingMode: 'environment' };
                            this.isBackCamera = true;
                        }
                        else {
                            this.isBackCamera = false;
                        }
                        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                            //video.src = window.URL.createObjectURL(stream);
                            videoElement.srcObject = stream;
                            videoElement.play();
                            resolve({});
                        }, (err) => {
                            reject(err);
                        });
                    }
                }
                else {
                    reject({ message: "camera already started" });
                }
            }));
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            const video = document.getElementById("video");
            if (video) {
                video.pause();
                const st = video.srcObject;
                const tracks = st.getTracks();
                for (var i = 0; i < tracks.length; i++) {
                    var track = tracks[i];
                    track.stop();
                }
                video.remove();
            }
        });
    }
    capture(_options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, _) => {
                const video = document.getElementById("video");
                const canvas = document.createElement("canvas");
                // video.width = video.offsetWidth;
                const context = canvas.getContext("2d");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                // flip horizontally back camera isn't used
                if (!this.isBackCamera) {
                    context.translate(video.videoWidth, 0);
                    context.scale(-1, 1);
                }
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                resolve({
                    value: canvas
                        .toDataURL("image/png")
                        .replace("data:image/png;base64,", ""),
                });
            });
        });
    }
    getSupportedFlashModes() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('getSupportedFlashModes not supported under the web platform');
        });
    }
    setFlashMode(_options) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('setFlashMode not supported under the web platform');
        });
    }
    flip() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('flip not supported under the web platform');
        });
    }
}
const CameraPreview = new CameraPreviewWeb();
export { CameraPreview };
import { registerWebPlugin } from "@capacitor/core";
registerWebPlugin(CameraPreview);
//# sourceMappingURL=web.js.map