import { GoogleOAuthProvider } from "@react-oauth/google"
import config from "../../../config"

export default function GoogleAuthProviderWrapper({ children }) {
 
  const clientId = config.googleClientId;

  if (!clientId) {
    return <div>Error: Google Client ID no configurado.</div>
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
}