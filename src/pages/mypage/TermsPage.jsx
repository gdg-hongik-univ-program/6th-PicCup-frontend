import BackHeader from '../../components/layout/BackHeader';
import { terms } from '../../constants/terms';

const TermsPage = () => {
  return (
    <main className="min-h-dvh px-4 pt-2 pb-4">
      <BackHeader title="서비스 약관" />

      <article className="mt-5 rounded-2xl bg-gray-50 px-5 py-6">
        <h2 className="text-base font-semibold">
          PicCup 서비스 이용약관
        </h2>

        <p className="mt-2 text-xs text-text-secondary">
          시행일: 2026년 8월 12일
        </p>

        <div className="mt-6 space-y-6">
          {terms.map((term) => (
            <section key={term.title}>
              <h3 className="text-sm font-semibold">
                {term.title}
              </h3>

              <p className="mt-2 whitespace-pre-line text-xs leading-6 text-text-secondary">
                {term.content}
              </p>
            </section>
          ))}
        </div>
      </article>

      <p className="px-2 py-5 text-center text-xs text-text-secondary">
        본 약관은 프로젝트 시연을 위한 초안입니다.
      </p>
    </main>
  );
};

export default TermsPage;