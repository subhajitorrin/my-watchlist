import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

function Login() {
  async function handleGoogleLogin(authResult) {
    try {
      if (authResult["code"]) {
        console.log(authResult);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: handleGoogleLogin,
    flow: "auto-code"
  });
  
  return (
    <div>
      <button onClick={googleLogin}>Login with google</button>
    </div>
  );
}

export default Login;
