const TrashActionBar = ({
  activeTab,
  selectedCount,
}) => {
  return (
    <div className="fixed inset-x-0 bottom-5 z-50 mx-auto grid w-full max-w-md grid-cols-2 gap-2 px-4">
      <button
        type="button"
        disabled={selectedCount === 0}
        className="h-12 rounded-xl bg-primary font-medium text-white shadow-lg disabled:bg-primary-muted"
      >
        {activeTab === 'rejected'
          ? '앨범에 추가'
          : '복구하기'}
      </button>

      <button
        type="button"
        disabled={selectedCount === 0}
        className="h-12 rounded-xl bg-gray-100 font-medium text-error shadow-lg ring-1 ring-border disabled:text-error/40"
      >
        영구 삭제
      </button>
    </div>
  );
};

export default TrashActionBar;
