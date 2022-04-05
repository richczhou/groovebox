import * as tf from '@tensorflow/tfjs'; 
import * as posenet from '@tensorflow-models/posenet';
import { drawKeypoints, drawSkeleton } from "./utils";

const initPostNet = async () => {
    const detectorConfig = {
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 640, height: 480 },
        multiplier: 0.75
      };
    // const detector = await poseDetection.createDetector(poseDetection.SupportedModels.PoseNet, detectorConfig);
    const detector = await posenet.load(detectorConfig);

    setInterval(() => {
        detect(detector);
    }, 1000)
}

const detect = async (detector) => {
    const estimationConfig = {
        maxPoses: 5,
        flipHorizontal: false,
        scoreThreshold: 0.5,
        nmsRadius: 20
    };
    let video = document.querySelector("#videoElement");
    video.width = 640;
    video.height = 480;

    let canvas = document.querySelector("#canvas");
    const poses = await detector.estimatePoses(video, estimationConfig);
    // console.log(poses)

    isRightRaised(poses);
    // drawCanvas(poses, canvas)
}

const drawCanvas = (poses, canvas) => { //, video, videoWidth, videoHeight) => {
    var ctx = canvas.getContext("2d");
    for (const figure of poses) {
        drawKeypoints(figure['keypoints'], 0.2, ctx);
        drawSkeleton(figure['keypoints'], 0.2, ctx);
    }
}

const isRightRaised = (poses) => {
    for (const figure of poses) {
        // console.log(figure)
        if(figure.score > 0.5 &&
           figure['keypoints'][0].score > 0.5 && figure['keypoints'][10].score > 0.5 &&
           figure['keypoints'][10].position.y > figure['keypoints'][0].position.y) {
               console.log("RAISED")
        }
    }
}

initPostNet()