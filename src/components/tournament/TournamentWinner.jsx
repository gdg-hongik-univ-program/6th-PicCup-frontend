import { Camera, Menu, House, Image, Crown, Share2, Download, Check } from "lucide-react"
import { Link } from "react-router"

const TournamentWinner = ({ //부모 TournamentPage가 값 전달
    winner,
    onUpload, //부모의 handleUploadBestPick 함수
    isUploading,
    uploadError,
    uploadedBestPick,
}) => {
  const capturedDate = new Date(winner.createdAt)
    .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
    //.replaceAll('. ', '/')
    //.replace('.', '');

    
  return (
    <main className="flex min-h-dvh flex-col">
        <div className="flex-1 px-4 pt-6">
            <header className="flex items-center justify-between px-2">
                <h1 className="text-3xl font-logo tracking-tight">
                PicCup
                </h1>

                <button
                type="button"
                className="flex size-10 items-center justify-center"
                aria-label="메뉴 열기"
                >
                <Menu size={24} />
                </button>
            </header>
            <section className="flex min-h-0 flex-1 flex-col items-center pt-4">
                <Crown
                    size={60}
                    strokeWidth={2.4}
                    className="relative z-10 -mb-1 text-primary"
                    aria-label="베스트픽 왕관"
                />
                
                <article className="rounded-3xl bg-white p-2 shadow-lg ring-1 ring-border">
                    <img
                        src={winner.previewUrl}
                        alt="최종 우승 사진"
                        className="block max-h-[56dvh] w-full rounded-3xl object-contain"
                    />
                    {uploadedBestPick && (
                        <div
                            role="status"
                            className="absolute inset-x-3 bottom-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-lg"
                        >
                            <Check size={18} strokeWidth={2.5} />
                            베스트픽 저장 완료
                        </div>
                    )}
              
                    <div className="flex h-10 mt-1 items-center justify-between"> 
                        <time
                            dateTime={winner.createdAt}
                            className="px-3 text-lg text-text-primary font-medium"
                        >
                            {capturedDate}
                        </time>

                        <div className="flex items-center gap-2 px-2">
                            <button
                                type="button"
                                onClick={onUpload}
                                disabled={isUploading || Boolean(uploadedBestPick)}
                                className="flex size-8 items-center justify-center rounded-full transition active:bg-primary-soft disabled:opacity-40"
                                aria-label="베스트픽 저장"
                            >
                                <Download size={24} />
                            </button>

                            <button
                                type="button"
                                className="flex size-8 items-center justify-center rounded-full transition active:bg-primary-soft"
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

                {isUploading && (
                    <p className="mt-3 text-sm font-semibold text-primary">
                    베스트픽 저장 중...
                    </p>
                )}

                {uploadError && (
                    <p role="alert" className="mt-3 text-sm text-error">
                    {uploadError}
                    </p>
                )}
            </section>
            <nav className="pointer-events-none fixed inset-x-0 bottom-8 z-50 mx-auto flex w-full max-w-md items-center justify-between px-10">
                <button
                type="button"
                className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-white/95 shadow-lg ring-1 ring-black/5"
                aria-label="앨범"
                >
                <Image size={24} />
                </button>

                <Link
                to="/"
                className="pointer-events-auto flex h-14 w-28 items-center justify-center rounded-full bg-white/95 shadow-lg ring-1 ring-black/5"
                aria-label="홈"
                >
                <House size={24} />
                </Link>

                <button
                type="button"
                className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-white/95 shadow-lg ring-1 ring-black/5"
                aria-label="카메라"
                >
                    <Camera size={24}/>
                </button>
            </nav>
        </div>
    </main>
    
  )
}

export default TournamentWinner

