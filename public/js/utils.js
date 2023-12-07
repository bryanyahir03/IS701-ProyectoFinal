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