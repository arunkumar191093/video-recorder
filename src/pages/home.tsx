import { useEffect, useRef, useState } from "react";
import { Button } from '../components/Button';

export const Home = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [recordingStream, setRecordingStream] = useState<any>(null);
  const [videoData, setVideoData] = useState<any>([]);
  const [recordedBlob, setRecordedBlob] = useState<any>(null);

  const videoStreamRef: any = useRef(null);
  let recorder: any = useRef(null);

  const checkForPermissions = async () => {
    setIsPermissionDenied(false);
    let navig: any = window.navigator;
    let stream = null;
    const constraints = {
      audio: true,
      video: {
        width: { min: 1024, ideal: 1280, max: 1280 },
        height: { min: 576, ideal: 576, max: 576 },
      },
    }

    if (navig.mediaDevices.getUserMedia) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        setHasPermission(true);
        /* use the stream */
        videoStreamRef.current.srcObject = stream;
        setRecordingStream(stream);
      } catch (err: any) {
        /* handle the error */
        console.error(`The following error occurred: ${err.name}`);
        if (err?.message === "Permission denied") {
          setIsPermissionDenied(true);
          // Explain why you need permission and how to update the permission setting
        }
      }
    } else {
      console.log("getUserMedia not supported");
      alert("Video Recording is not supported in the current browser");
    }
  }

  const startRecording = () => {
    console.log('Recording started');
    setIsRecording(true);
    const media = new MediaRecorder(recordingStream, { mimeType: 'video/webm; codecs="opus,vp8"' });
    recorder.current = media;
    recorder.current.start();

    let localVideoChunks: any = [];

    recorder.current.ondataavailable = (event: any) => {
      if (event.data && event.data.size > 0) {
        localVideoChunks.push(event.data);
      }
    };

    setVideoData(localVideoChunks);
  }

  const stopRecording = () => {
    console.log('Recording stopped');
    setIsRecording(false);
    recorder.current.stop();

    recorder.current.onstop = () => {
      const videoBlob = new Blob(videoData, { type: 'video/webm; codecs="opus,vp8"' });
      const videoUrl = URL.createObjectURL(videoBlob);
      setRecordedBlob(videoUrl);
      setVideoData([]);
    };
  }
  return (
    <div>
      {
        !hasPermission &&
        <div className="flex items-center justify-center flex-col">
          <div className="py-2 px-3 bg-red-200 text-red-600 rounded-md mb-2">
            Please grant permission to access microphone &amp; camera
          </div>
          <Button
            buttonText="Grant Permission"
            handleClick={() => checkForPermissions()} />
          {
            isPermissionDenied &&
            <div>
              <b className="mb-2">Step to grant permission: </b>
              <ul className="">
                <li className="pl-4"> - If you do not see the permissions pop-up. Please refer the below screenshot</li>
                <li className="pl-4"> - Click on the <code>ℹ</code> icon in the URL box</li>
                <li className="pl-4"> - Click on "Reset Permission" button in the pop-up</li>
                <li className="pl-4"> - Reload the page</li>
              </ul>
              <div className="flex items-center justify-center mt-4">
                <img src="../assets/permission-error-steps.png" alt="" width={400} height={400} />
              </div>
            </div>
          }
        </div>
      }
      <div className="flex justify-center">
        {
          !recordedBlob &&
          <div className="relative">
            {
              isRecording &&
              <span className="absolute flex h-4 w-4 right-4 top-2 z-10">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
            }
            <video ref={videoStreamRef} autoPlay className="transform scale-x-[-1]"></video>
          </div>
        }
        {
          !!recordedBlob &&
          <video id="recorded" src={recordedBlob} controls></video>
        }
      </div>
      <div id="btn-actions">
        {
          hasPermission &&
          <>
            {
              !!recordedBlob ?
                <Button
                  className="bg-white text-blue-700 border-blue-700 border "
                  handleClick={() => stopRecording()} >
                  <a download href={recordedBlob}>
                    Download Recording
                  </a>
                </Button> :
                <>
                  <Button
                    buttonText="Start Recording"
                    className="bg-green-700"
                    disabled={isRecording}
                    handleClick={() => startRecording()} />
                  <Button
                    buttonText="Stop Recording"
                    className="bg-red-700"
                    disabled={!isRecording}
                    handleClick={() => stopRecording()} />
                </>
            }

          </>
        }
      </div>
    </div>
  )
}