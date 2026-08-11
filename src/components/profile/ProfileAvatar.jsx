const ProfileAvatar = ({
  src,
  alt = '프로필 이미지',
  className = 'size-14',
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative shrink-0 overflow-hidden rounded-full bg-gray-50 ${className}`}
    >
      <span className="absolute left-1/2 top-[15%] size-[43%] -translate-x-1/2 rounded-full bg-gray-300" />

      <span className="absolute left-1/2 top-[62%] h-[60%] w-[80%] -translate-x-1/2 rounded-[50%] bg-gray-300" />
    </div>
  );
};

export default ProfileAvatar;