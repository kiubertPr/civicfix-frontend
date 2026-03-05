import { GoogleLogin } from "@react-oauth/google"

export default function GoogleAuthButton({ onSuccess, onError, isSignUp = false }) {
  const handleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      onSuccess(credentialResponse.credential)
    }
  }

  const handleError = () => {
    onError("Google authentication failed")
  }

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text={isSignUp ? "signup_with" : "signin_with"}
        shape="rectangular"
        theme="outline"
        size="large"
        width="100%"
      />
    </div>
  )
}
