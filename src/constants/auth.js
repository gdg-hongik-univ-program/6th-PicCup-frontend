export const AUTH_FIELD_LIMITS = {
  nickname: 10,
  passwordMin: 10,
  passwordMax: 16,
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_PATTERN =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,16}$/;
