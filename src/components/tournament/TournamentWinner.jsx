import { Crown, Share2, Download, Check } from "lucide-react"
import AppHeader from "../layout/AppHeader"
import BottomNav from "../layout/BottomNav"

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  downloadImage,
  shareImage,
} from '../../libs/imageActions';

import { getLocalDateString } from '../../utils/date';

const TournamentWinner = ({ //부모 TournamentPage가 값 전달
    winner,
    uploadError,
}) => {
  const [imageActionError, setImageActionError] = useState('');

  const [
    isDownloadComplete,
    setIsDownloadComplete,
    ] = useState(false);

  const downloadMessageTimerRef = useRef(null);

  const fileName = `piccup-${getLocalDateString(
    new Date(winner.createdAt),
    )}-${winner.id}.jpg`;

    // 로컬 우승 사진 다운로드
  const handleDownload = async () => {
    try {
        setImageActionError('');
        setIsDownloadComplete(false);

        await downloadImage({
        imageBlob: winner.blob,
        fileName,
        });

        // 다운로드 요청 성공 후 완료 메시지 표시
        setIsDownloadComplete(true);

        if (downloadMessageTimerRef.current) {
        window.clearTimeout(
            downloadMessageTimerRef.current,
        );
        }

        downloadMessageTimerRef.current =
        window.setTimeout(() => {
            setIsDownloadComplete(false);
        }, 5000);//5초 후 제거
    } catch (error) {
        console.error(
        '우승 사진 다운로드 실패:',
        error,
        );

        setIsDownloadComplete(false);
        setImageActionError(
        '사진을 다운로드하지 못했습니다.',
        );
    }
  };

    // 로컬 우승 사진 공유
  const handleShare = async () => {
    try {
        setImageActionError('');

        await shareImage({
        imageBlob: winner.blob,
        fileName,
        title: 'PicCup Best Pick',
        });
    } catch (error) {
        if (error.name === 'AbortError') return;

        console.error(
        '우승 사진 공유 실패:',
        error,
        );

        setImageActionError(
        '사진을 공유하지 못했습니다.',
        );
    }
  };
  
  const capturedDate = new Date(winner.createdAt)
    .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
    //.replaceAll('. ', '/')
    //.replace('.', '');

    console.log(
        '우승 사진 용량:',
        `${(winner.blob.size / 1024 / 1024).toFixed(2)} MB`,
    );

  // 다운로드 완료 메시지 타이머 정리
  useEffect(() => {
    return () => {
        if (downloadMessageTimerRef.current) {
        window.clearTimeout(
            downloadMessageTimerRef.current,
        );
        }
    };
  }, []);

    
  return (
    <main className="flex min-h-dvh flex-col">
        <div className="flex-1 px-4 pt-4">
            <AppHeader />
            <section className="flex min-h-0 flex-1 flex-col items-center">
                <Crown
                    size={60}
                    strokeWidth={2.4}
                    className="relative z-10 -mb-1 text-primary"
                    aria-label="베스트픽 왕관"
                />
                
                <article className="rounded-3xl bg-white p-2 shadow-lg ring-1 ring-border">
                    <div className="relative overflow-hidden rounded-3xl">
                        <img
                            src={winner.previewUrl}
                            alt="최종 우승 사진"
                            className="block max-h-[52dvh] w-full rounded-3xl object-contain"
                        />
                        {isDownloadComplete && (
                            <div
                                role="status"
                                aria-live="polite"
                                className="absolute bottom-6 left-1/2 flex h-11 w-[82%] -translate-x-1/2 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-semibold text-white shadow-lg"
                            >
                                <Check/>
                                이미지 다운로드 완료
                            </div>
                        )}

                        {!isDownloadComplete &&
                            imageActionError && (
                                <p
                                role="alert"
                                className="absolute bottom-6 left-1/2 w-[82%] -translate-x-1/2 text-center text-sm font-semibold text-error"
                                >
                                {imageActionError}
                                </p>
                            )}

                        {!isDownloadComplete &&
                            !imageActionError &&
                            uploadError && (
                                <p
                                role="alert"
                                className="absolute bottom-6 left-1/2 w-[82%] -translate-x-1/2 text-center text-sm font-semibold text-error"
                                >
                                {uploadError}
                                </p>
                        )}
                    </div>
                    
                    <div className="flex h-10 mt-1 items-center justify-between"> 
                        <time
                            dateTime={winner.createdAt}
                            className="px-3 text-lg text-text-primary font-medium"
                        >
                            {capturedDate}
                        </time>

                        <div className="flex items-center gap-3 px-2">
                            <button
                                type="button"
                                onClick={handleDownload}
                                className="flex size-8 items-center justify-center rounded-lg transition active:bg-gray-100 disabled:opacity-40"
                                aria-label="베스트픽 다운로드"
                            >
                                <Download size={24} />
                            </button>

                            <button
                                type="button"
                                onClick={handleShare}
                                className="flex size-8 items-center justify-center rounded-lg transition active:bg-gray-100 disabled:opacity-40"
                                aria-label="베스트픽 공유"
                            >
                                <Share2 size={24} />
                            </button>
                        </div>
                    </div>
                </article>

                <div className="mt-6 text-center">
                    <h2 className="text-xl font-bold">
                    오늘의 Best Pick!
                    </h2>
                    <p className="mt-1 text-base text-text-secondary">
                    홈의 마이캘린더를 확인해보세요.
                    </p>
                </div>
            </section>
            <BottomNav />
        </div>
    </main>
    
  )
}

export default TournamentWinner

