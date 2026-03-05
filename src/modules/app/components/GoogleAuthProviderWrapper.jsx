import { GoogleOAuthProvider } from "@react-oauth/google"

export default function GoogleAuthProviderWrapper({ children }) {
 
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

  if (!clientId) {
    return <div>Error: Google Client ID no configurado.</div>
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
}