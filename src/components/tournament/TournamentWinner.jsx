const TournamentWinner = ({ //부모 TournamentPage가 값 전달
    winner,
    onUpload, //부모의 handleUploadBestPick 함수
    isUploading,
    uploadError,
    uploadedBestPick,
}) => {
  return (
    <main className="flex h-dvh flex-col overflow-hidden">
        <header className="shrink-0"></header>
            <section className="flex flex-1 min-h-0 flex-col gap-2 px-6 pb-5">
                <h2 className="text-xl font-bold">
                    우승 사진
                </h2>
                <img
                    src={winner.previewUrl}
                    alt="최종 우승 사진"
                    className="w-full max-w-72 rounded-xl object-cover"
                />

                <button
                    type="button"
                    onClick={onUpload}
                    disabled={isUploading || Boolean(uploadedBestPick)}
                    className="rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-50"
                >
                    {isUploading ? '저장 중...' : '베스트픽 저장'}
                </button>

                {uploadError && (
                    <p className="text-sm text-red-500">
                        {uploadError}
                    </p>
                )}
                {uploadedBestPick && (
                    <p className="text-sm font-bold text-primary">
                        베스트픽이 저장되었습니다.
                    </p>
                )}
            </section>
    </main>
  )
}

export default TournamentWinner

