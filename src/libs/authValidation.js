const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,16}$/;

export const isValidPassword = (password) => {
  return PASSWORD_PATTERN.test(password);
};

export const validateSignupForm = ({
  nickname,
  email,
  password,
  passwordConfirm,
}) => {
  const trimmedNickname = nickname.trim();
  const trimmedEmail = email.trim();

  if (
    !trimmedNickname ||
    !trimmedEmail ||
    !password ||
    !passwordConfirm
  ) {
    return '모든 항목을 입력해주세요.';
  }

  if (trimmedNickname.length > 10) {
    return '닉네임은 1~10자로 입력해주세요.';
  }

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return '올바른 이메일을 입력해주세요.';
  }

  if (!isValidPassword(password)) {
    return '비밀번호는 10~16자 영문과 숫자로 입력해주세요.';
  }

  if (password !== passwordConfirm) {
    return '비밀번호가 일치하지 않습니다.';
  }

  return '';
};

export const validatePasswordResetForm = ({
  email,
  newPassword,
  passwordConfirm,
}) => {
  const trimmedEmail = email.trim();

  if (
    !trimmedEmail ||
    !newPassword ||
    !passwordConfirm
  ) {
    return '모든 항목을 입력해주세요.';
  }

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return '올바른 이메일을 입력해주세요.';
  }

  if (!isValidPassword(newPassword)) {
    return '비밀번호는 10~16자 영문과 숫자로 입력해주세요.';
  }

  if (newPassword !== passwordConfirm) {
    return '비밀번호가 일치하지 않습니다.';
  }

  return '';
};