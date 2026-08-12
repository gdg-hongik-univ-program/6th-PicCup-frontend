import { useId } from 'react';

const AuthTextField = ({
  label,
  type = 'text',
  helperText = '',
  className = '',
  ...inputProps
}) => {
  const inputId = useId();
  const helperId = helperText
    ? `${inputId}-helper`
    : undefined;

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="sr-only" //화면엔 안보임
      >
        {label}
      </label>

      <input
        {...inputProps}
        id={inputId}
        type={type}
        aria-describedby={helperId}
        className="h-12 w-full rounded-xl border border-border bg-surface px-4 outline-none focus:border-primary read-only:bg-gray-100 read-only:text-text-primary"
      />

      {helperText && (
        <p
          id={helperId}
          className="mt-1 px-2 text-xs text-text-secondary"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default AuthTextField;