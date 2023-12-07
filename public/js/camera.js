import { GREEN } from "./params.js";
import { calculateEAR, calculateEmotionAverages, estaDurmiendo } from "./utils.js";
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;


export class Camera {
    constructor(detector) {
        this.detector = detector;
        this.video = document.getElementById('video');
        this.audio = document.getElementById('audio-alarm');
        this.canvas = document.getElementById('output');
        this.ctx = this.canvas.getContext('2d');
        this.drawingUtils = new DrawingUtils(this.ctx);
        this.seconds = document.getElementById('segundos').value;
        this.threshold = document.getElementById('treshold').value;
        this.lastVideoTime = -1;
        this.earRatios = Array(100).fill(0);
        this.earChart = this.setupEARChart();        
        this.setupCamera();

        return this;
    }

    setupEARChart() {
        const chart = new Chart(document.getElementById('earChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: this.earRatios.length }, (_, i) => i + 1),
                datasets: [
                    {
                        label: 'EAR Ratios by frame',
                        data: this.earRatios,
                        borderColor: 'rgba(75, 192, 192, 1)', // Line color
                        borderWidth: 1,
                        fill: false,
                    },
                ],
            },
            options: {
                animation: false,
                responsive: false,
            },
        });
        return chart
    }

    async setupCamera(cameraParam) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
        }

        const videoConfig = {
            'audio': false,
            'video': {
              facingMode: 'user',
              width: 640,
              height: 480,
              frameRate: {
                ideal: 60,
              },
            },
        };

        const stream = await navigator.mediaDevices.getUserMedia(videoConfig);
        this.video.srcObject = stream;

        await new Promise((resolve) => {
            this.video.onloadedmetadata = () => {
              resolve(video);
            };
        });
      
        this.video.play();

        const videoWidth = this.video.videoWidth;
        const videoHeight = this.video.videoHeight;

        this.video.width = videoWidth;
        this.video.height = videoHeight;

        this.canvas.width = videoWidth;
        this.canvas.height = videoHeight;

        this.canvas.style.transform = 'scaleX(-1)';
        this.video.style.transform = 'scaleX(-1)';
    }



    // drawResults(faces, triangulateMesh, boundingBox) {
    //     const eyesLabels = ['rightEye', 'leftEye'];
    
    //     faces.forEach((face) => {
    //         const keypoints = face.keypoints
    //             .filter((keypoint) => keypoint.name && eyesLabels.includes(keypoint.name))
    //             .map((keypoint) => [keypoint.x, keypoint.y]);
    
    //         this.ctx.fillStyle = GREEN;
    
    //         for (let i = 0; i < keypoints.length; i++) {
    //             const x = keypoints[i][0];
    //             const y = keypoints[i][1];
    
    //             this.ctx.beginPath();
    //             this.ctx.arc(x, y, 1, 0, 2 * Math.PI);
    //             this.ctx.fill();
    //         }
    //     });
    // }


    async renderPrediction() {
        const radio = this.video.videoHeight / video.videoWidth;
        this.video.style.width = 640 + "px";
        this.video.style.height = 640 * radio + "px";
        this.canvas.style.width = 640 + "px";
        this.canvas.style.height = 640 * radio + "px";
        this.canvas.width = video.videoWidth;
        this.canvas.height = video.videoHeight;
        this.results = null;
        var faces = null;
        var blends = null; 

        if (this.video.readyState < 2) {
            await new Promise((resolve) => {
                this.video.onloadeddata = () => {
                    resolve(video);
                };
            });
        }

        let startTimesMS = performance.now();
        if (this.lastVideoTime !== this.video.currentTime) {
            this.lastVideoTime = this.video.currentTime;
            this.results = this.detector.detectForVideo(video, startTimesMS);
            faces = this.results.faceLandmarks;
            blends = this.results.faceBlendshapes;
        }

        if (this.results && this.results.faceLandmarks) {
            for (const landmarks of this.results.faceLandmarks) {
              this.drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                { color: "#C0C0C070", lineWidth: 1 }
              );
              this.drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
                { color: "#FF3030" }
              );
              this.drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
                { color: "#FF3030" }
              );
              this.drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
                { color: "#30FF30" }
              );
              this.drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
                { color: "#30FF30" }
              );
              this.drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
                { color: "#E0E0E0" }
              );
              this.drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_LIPS,
                { color: "#E0E0E0" }
              );
              this.drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
                { color: "#FF3030" }
              );
              this.drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
                { color: "#30FF30" }
              );
            }
        }



        // const faces = await this.detector.estimateFaces(this.video, {flipHorizontal: false});
        
        
        
        if (faces && faces.length > 0) {
            // this.drawResults(faces, true, true);

            const face = faces[0];

            const EARRatio = calculateEAR(face);
            this.earRatios.push(EARRatio);

            if (this.earRatios.length > 100) {
                this.earRatios.shift();
            }

            // Activar alarma cuando se duerma.
            if (estaDurmiendo(this.earRatios, this.threshold, this.seconds)) {
                if (this.audio.paused) {
                    this.audio.play();
                }
            }
            else if (!this.audio.paused) {
                this.audio.pause();
            }

            this.earChart.data.datasets[0].data = this.earRatios;
            this.earChart.update();

            // console.log(detectarEmocion(this.results.faceBlendshapes));
            // console.log(this.results.faceBlendshapes);
            // console.log(calculateEmotionAverages(this.results.faceBlendshapes));
        
            const emotionsValues = calculateEmotionAverages(this.results.faceBlendshapes);

            document.getElementById('happy').value = emotionsValues.happy;
            document.getElementById('sad').value = emotionsValues.sad;
            document.getElementById('angry').value = emotionsValues.angry;
            // document.getElementById('neutral').value = emotionsValues.neutral;
            document.getElementById('surprised').value = emotionsValues.surprised;


        }

        requestAnimationFrame(() => this.renderPrediction());
    }
}
