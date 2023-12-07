import { Camera } from './camera.js';


async function createDetector() {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
        runtime: 'tfjs',
        maxFaces: 1,
        refineLandmarks: true,
    };

    const detector = faceLandmarksDetection.createDetector(model, detectorConfig);

    return detector;
}





async function app() {
    const detector = await createDetector();
    const camera = new Camera(detector);

    camera.renderPrediction();
}

app();