import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "length of username must be longer than 2 characters",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot include @ in username",
      },
    ];
  }

  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email address",
      },
    ];
  }

  if (options.password.length <= 1) {
    return [
      {
        field: "password",
        message: "length of password must be longer than 1 character",
      },
    ];
  }

  return null;
};
