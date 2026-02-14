import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "./api";

export const useLogin = () => {
  return useMutation({ mutationFn: loginRequest });
};
