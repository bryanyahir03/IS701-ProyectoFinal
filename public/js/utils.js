import { EYE_KEYPOINTS_PAIRS } from "./params.js";

function euclideanDistance(point1, point2) {
    if (!point1 || !point2 || !('x' in point1) || !('y' in point1) || !('z' in point1) || !('x' in point2) || !('y' in point2) || !('z' in point2)) {
        throw new Error('Invalid input. Both points must have x, y, and z coordinates.');
    }

    const distance = Math.sqrt(
        Math.pow(point2.x - point1.x, 2) +
        Math.pow(point2.y - point1.y, 2) +
        Math.pow(point2.z - point1.z, 2)
    );

    return distance;
}


export function calculateEAR(keypoints) {
    var EARRatio = 0;

    for (const eyeKey in EYE_KEYPOINTS_PAIRS) {
        const eye = EYE_KEYPOINTS_PAIRS[eyeKey];
        let verticalDist = 0;

        const horizontalDist = euclideanDistance(keypoints[eye.horizontal[0]], keypoints[eye.horizontal[1]]);
        
        for (let i = 0; i < eye.vertical.length; i++) {
            verticalDist += euclideanDistance(keypoints[eye.vertical[i][0]], keypoints[eye.vertical[i][1]]);
        }

        EARRatio += verticalDist / (2 * horizontalDist);
    }

    EARRatio /= 2;

    return EARRatio;
}


export function estaDurmiendo(arr, threshold, seconds) {
    const numElements = Math.min(seconds * 5, 100);
  
    const startIndex = (arr.length - numElements) % arr.length;
    const lastValues = arr.slice(startIndex);
  
    const estaDormido = lastValues.every(value => value <= threshold);
  
    return estaDormido;
  }
  export function calculateEmotionAverages(data) {
    const entry = data[0];

    // Initialize emotion scores
    let happyScore = 0;
    let sadScore = 0;
    let neutralScore = 0;
    let angryScore = 0;
    let surprisedScore = 0;

    const eyeBlinkLeft = entry.categories[9].score;
    const eyeBlinkRight = entry.categories[10].score;
    const eyeLookDownLeft = entry.categories[11].score;
    const eyeLookDownRight = entry.categories[12].score;
    const browInnerUp = entry.categories[3].score;
    const browOuterUpLeft = entry.categories[4].score;
    const browOuterUpRight = entry.categories[5].score;
    const mouthSmileLeft = entry.categories[44].score;
    const mouthSmileRight = entry.categories[45].score;
    const eyeLookUpLeft = entry.categories[17].score;
    const eyeLookUpRight = entry.categories[18].score;
    const browDownLeft = entry.categories[1].score;
    const browDownRight = entry.categories[2].score;
    const mouthFrownLeft = entry.categories[30].score;
    const mouthFrownRight = entry.categories[31].score;
    const _neutral = entry.categories[0].score;
    const eyeSquintLeft = entry.categories[19].score;
    const eyeSquintRight = entry.categories[20].score;
    const mouthPressLeft = entry.categories[36].score;
    const mouthPressRight = entry.categories[37].score;
    const eyeLookOutLeft = entry.categories[15].score;
    const eyeLookOutRight = entry.categories[16].score;
    const mouthOpen = entry.categories[25].score;
    const mouthPucker = entry.categories[38].score;


    happyScore = (mouthSmileLeft + mouthSmileRight) / 2;
    angryScore = (browDownLeft + browDownRight) / 2;
    surprisedScore = (mouthPucker + browInnerUp + browOuterUpLeft + browOuterUpRight) / 4;
    sadScore = (mouthFrownLeft + mouthFrownRight) / 2;
    neutralScore = _neutral;

    // Return the results
    return {
        happy: happyScore,
        sad: sadScore,
        neutral: neutralScore,
        angry: angryScore,
        surprised: surprisedScore,
    };
}
