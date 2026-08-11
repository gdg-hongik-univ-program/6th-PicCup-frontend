import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

const BackHeader = ({
  title,
  onBack,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate(-1);
  };

  return (
    <header className="flex h-12 items-center">
      <button
        type="button"
        onClick={handleBack}
        className="flex size-10 items-center justify-center"
        aria-label="뒤로가기"
      >
        <ChevronLeft size={24} />
      </button>

      <h1 className="ml-1 text-lg font-semibold">
        {title}
      </h1>
    </header>
  );
};

export default BackHeader;