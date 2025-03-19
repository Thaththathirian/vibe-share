export const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password)
};

export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword
}

export const getPasswordErrorMessage = () => {
  return "Min 8 chars with required complexity."
}
// "Password must be 8+ chars with uppercase, lowercase, number & special char."