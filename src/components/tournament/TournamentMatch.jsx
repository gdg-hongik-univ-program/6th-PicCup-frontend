import { ArrowLeft } from "lucide-react";
import { ASPECT_RATIO_CONFIG } from "../../constants/ratio";
import { Link } from "react-router";

const TournamentMatch = ({
  firstPhoto,
  secondPhoto,
  onSelectPhoto,
  roundPhotosCount,
  matchIndex,
  candidateCount,
}) => {
  
  const firstRatio = 
    ASPECT_RATIO_CONFIG[firstPhoto.aspectRatio]
      ?.tournament
      ?.className ?? 'aspect-square';
  const secondRatio = 
    ASPECT_RATIO_CONFIG[secondPhoto.aspectRatio]
      ?.tournament
      ?.className ?? 'aspect-square';

  const roundSize =
    2 ** Math.ceil(Math.log2(roundPhotosCount)); //Ceil은 올림

  const roundLabel =
    roundSize === 2
      ? '결승'
      : `${roundSize}강`;

  const totalMatchCount =
    Math.floor(roundPhotosCount / 2); //floor는 소수점 이하 버림

  const currentMatchNumber =
    Math.floor(matchIndex / 2) + 1;
  
  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <header className="relative h-20 shrink-0 px-4 pt-8">
          <Link
            to='/camera'
            className="absolute flex size-12 items-center justify-center rounded-full bg-white/95 shadow-lg ring-1 ring-black/5"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="flex h-full flex-col items-center pt-2 text-center">
            <p className="text-lg font-bold">
              마음에 드는 사진을 골라주세요.
            </p>

            <p className="mt-3 font-semibold">
              {roundLabel}
            </p>
            <div className="mt-3 flex gap-1.5">
              {Array.from({
                length: totalMatchCount,
              }).map((_, index) => ( //_는 현재 배열 요소의 값(실제로 사용X)
                <span
                  key={index}
                  className={`size-2 rounded-full ${
                    index + 1 < currentMatchNumber
                      ? 'bg-primary'
                      : 'bg-gray-200'
                  }`}
                />
              )) 
              }
            </div>
          </div>
      </header>

      <section className="flex flex-1 min-h-0 flex-col items-center justify-center gap-2 px-6">
        {firstPhoto && secondPhoto && (
          <>
            <button
              type="button"
              onClick={() => onSelectPhoto(firstPhoto)}
              className={`max-h-[34dvh] max-w-full overflow-hidden rounded-2xl ring-4 ring-white shadow-2xl ${firstRatio}`}
            >
              <img
                src={firstPhoto.previewUrl}
                alt="위 후보 사진"
                className = "h-full w-full object-cover"
              />
            </button>

            <span className="shrink-0 font-medium">
              VS
            </span>

            <button
              type="button"
              onClick={() => onSelectPhoto(secondPhoto)}
              className={`max-h-[34dvh] max-w-full overflow-hidden rounded-2xl ring-4 ring-white shadow-2xl ${secondRatio}`}
            >
              <img
                src={secondPhoto.previewUrl}
                alt="아래 후보 사진"
                className="h-full w-full object-cover"
              />
            </button>
            <span className="mt-4 shrink-0 text-sm font-medium">
              총 {candidateCount}장 중에서 고르는 중
            </span>
          </>
        )}
      </section>
    </main>
  );
};

export default TournamentMatch;