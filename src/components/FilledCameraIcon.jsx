const FilledCameraIcon = ({
  size = 24,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M8.2 5.2 9.6 3h4.8l1.4 2.2H19A3 3 0 0 1 22 8v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h3.2Z"
      />

      <circle
        cx="12"
        cy="13"
        r="3.6"
        fill="white"
      />
    </svg>
  );
};

export default FilledCameraIcon;
