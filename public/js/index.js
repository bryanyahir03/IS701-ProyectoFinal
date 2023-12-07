import { Camera } from './camera.js';
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

async function createDetector() {
    const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
    });

    return faceLandmarker;


    // const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    // const detectorConfig = {
    //     runtime: 'tfjs',
    //     maxFaces: 1,
    //     refineLandmarks: true,
    //     outputFaceBlendshapes: true,
    // };

    // const detector = faceLandmarksDetection.createDetector(model, detectorConfig);

    // return detector;
}





async function app() {
    const detector = await createDetector();
    const camera = new Camera(detector);

    camera.renderPrediction();
}

app();