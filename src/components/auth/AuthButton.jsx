const AuthButton = ({
  children,
  type = 'button',
  disabled = false,
  isProcessing = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isProcessing}
      aria-busy={isProcessing}
      onClick={onClick}
      className="h-12 w-full rounded-xl bg-primary font-semibold text-background shadow-sm"
    >
      {children}
    </button>
  );
};

export default AuthButton;
