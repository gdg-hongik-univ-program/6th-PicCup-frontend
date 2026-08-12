import {
  AUTH_FIELD_LIMITS,
  EMAIL_PATTERN,
  PASSWORD_PATTERN,
} from '../constants/auth';

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

  if (
    trimmedNickname.length >
    AUTH_FIELD_LIMITS.nickname
  ) {
    return `닉네임은 1~${AUTH_FIELD_LIMITS.nickname}자로 입력해주세요.`;
  }

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return '올바른 이메일을 입력해주세요.';
  }

  if (!isValidPassword(password)) {
    return `비밀번호는 ${AUTH_FIELD_LIMITS.passwordMin}~${AUTH_FIELD_LIMITS.passwordMax}자 영문과 숫자로 입력해주세요.`;
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
    return `비밀번호는 ${AUTH_FIELD_LIMITS.passwordMin}~${AUTH_FIELD_LIMITS.passwordMax}자 영문과 숫자로 입력해주세요.`;
  }

  if (newPassword !== passwordConfirm) {
    return '비밀번호가 일치하지 않습니다.';
  }

  return '';
};
