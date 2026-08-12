import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import CameraActions from '../components/camera/CameraActions';
import CameraViewport from '../components/camera/CameraViewport';
import { ASPECT_RATIO_CONFIG } from '../constants/ratio';
import useCameraStream from '../hooks/camera/useCameraStream';
import usePhotoCapture from '../hooks/camera/usePhotoCapture';

import useCategoryStore from '../store/useCategoryStore';

const CameraPage = () => {
  const sessionIdRef = useRef(null); //세션 ID를 보관

  const [aspectRatio, setAspectRatio] = useState('3/4');

  const navigate = useNavigate();
  const ratioConfig = ASPECT_RATIO_CONFIG[aspectRatio]; //비율 설정

  const selectedCategory = useCategoryStore(
    (state) => state.selectedCategory,
  );

  const {
    videoRef,
    isCameraOn,
    cameraError,
    facingMode,
    startCamera: openCamera,//훅이 반환한 startCamera를 openCamera라는 이름으로 꺼냄
    stopCamera,
    switchCamera,
  } = useCameraStream();

  const {
    photos,
    latestPhoto,
    captureError,
    capturePhoto,
    resetPhotos,
  } = usePhotoCapture({
    videoRef,
    isCameraOn,
    sessionIdRef,
    targetRatio: ratioConfig.value, //훅에 ratio 값 전달
    aspectRatio,
  })


  useEffect(() => { //카메라 자동 시작
    const startCamera = async () => {
      const didStart = await openCamera();

      if (!didStart) {
        return;
      }

      sessionIdRef.current = crypto.randomUUID();
      resetPhotos();
    };

    startCamera();
  }, [openCamera, resetPhotos]);

  const completeCapture = () => { //토너먼트로 넘어가는 함수
    const sessionId = sessionIdRef.current;

    if (!sessionId || photos.length === 0) {
      return;
    }

    stopCamera();
    navigate(`/tournament/${sessionId}`);
  }
  const aspectRatioClass = ratioConfig.camera.className;
  const cameraPositionClass = ratioConfig.camera.position;
  const changeAspectRatio = () => {
    setAspectRatio(ratioConfig.next);
  }

  return (
    <main className="relative mx-auto h-dvh w-full max-w-md overflow-hidden">
      <CameraViewport
        selectedCategory={selectedCategory}
        cameraPositionClass={cameraPositionClass}
        aspectRatioClass={aspectRatioClass}
        videoRef={videoRef}
        facingMode={facingMode}
      />

      <CameraActions
        aspectRatio={aspectRatio}
        isCameraOn={isCameraOn}
        latestPhoto={latestPhoto}
        photoCount={photos.length}
        cameraError={cameraError}
        captureError={captureError}
        onChangeAspectRatio={changeAspectRatio}
        onCapture={capturePhoto}
        onSwitchCamera={switchCamera}
        onComplete={completeCapture}
      />
    </main>
  );
};

export default CameraPage;


/*
useState → 카메라가 켜졌는지, 오류 메시지가 있는지 저장
useRef → video 태그와 카메라 stream 기억
useEffect → 페이지를 벗어날 때 카메라 종료

getUserMedia()로 MediaStream 객체를 받아온 것이 streamRef.current에 저장됨

cameraError → 권한 요청 또는 카메라 스트림 실행 실패
captureError → 촬영, Blob 생성, IndexedDB 저장 실패
*/
