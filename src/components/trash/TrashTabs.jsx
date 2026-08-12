import clsx from 'clsx';

const TrashTabs = ({ activeTab, onChange }) => {
  return (
    <div className="mt-3 grid grid-cols-2 border-b border-border">
      <button
        type="button"
        onClick={() => onChange('rejected')}
        className={clsx(
          'border-b-2 py-3 text-sm',
          activeTab === 'rejected'
            ? 'border-primary font-semibold text-text-primary'
            : 'border-transparent text-text-secondary'
        )}
      >
        탈락 사진
      </button>

      <button
        type="button"
        onClick={() => onChange('best-pick')}
        className={clsx(
          'border-b-2 py-3 text-sm',
          activeTab === 'best-pick'
            ? 'border-primary font-semibold text-text-primary'
            : 'border-transparent text-text-secondary'
        )}
      >
        삭제한 베스트픽
      </button>
    </div>
  );
};

export default TrashTabs;
