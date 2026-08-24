import {
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { terms } from '../../constants/terms';

const TermsAgreement = ({
  isAgreed,
  isExpanded,
  onAgreementChange,
  onToggle,
}) => {
  return (
    <section className="mt-5 rounded-2xl bg-background px-4 py-1">
      <div className="flex items-center gap-3">
        <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-sm">
          <span className="relative size-4 shrink-0">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={onAgreementChange}
              className="peer absolute inset-0 size-4 appearance-none rounded border border-border-strong bg-background checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
            <Check
              size={12}
              strokeWidth={3}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-background opacity-0 peer-checked:opacity-100"
            />
          </span>

          <span className="min-w-0">
            <span className="font-semibold text-primary">[필수]</span>{' '}
            서비스 이용약관에 동의합니다.
          </span>
        </label>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls="signup-terms-detail"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-text-secondary active:bg-gray-100"
        >
          {isExpanded ? (
            <ChevronUp size={18} aria-hidden="true" />
          ) : (
            <ChevronDown size={18} aria-hidden="true" />
          )}
          <span className="sr-only">
            약관 상세 내용 {isExpanded ? '접기' : '펼치기'}
          </span>
        </button>
      </div>

      {isExpanded && (
        <div
          id="signup-terms-detail"
          className="mt-1 max-h-20 space-y-4 overflow-y-auto border-t border-border pt-3 pr-1"
        >
          {terms.map((term) => (
            <section key={term.title}>
              <h3 className="text-xs font-semibold">
                {term.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-text-secondary">
                {term.content}
              </p>
            </section>
          ))}
        </div>
      )}
    </section>
  );
};

export default TermsAgreement;
