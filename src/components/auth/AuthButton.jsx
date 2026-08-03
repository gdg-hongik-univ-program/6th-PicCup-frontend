const AuthButton = ({
  children,
  type = 'button',
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="h-12 w-full rounded-xl bg-primary font-semibold text-white active:bg-primary-pressed disabled:cursor-not-allowed disabled:bg-primary-muted"
    >
      {children}
    </button>
  );
};

export default AuthButton;