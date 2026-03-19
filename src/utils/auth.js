export async function fetchSmartConfig(iss) {
  const response = await fetch(`${iss}/.well-known/smart-configuration`)
  if (!response.ok) {
    throw new Error("Failed to fetch SMART configuration")
  }
  const config = await response.json()
  console.log("SMART Config:", config)
  return config
}

export function buildAuthUrl(authEndpoint, iss, launchToken) {
  const clientId = import.meta.env.VITE_CLIENT_ID
  const redirectUri = import.meta.env.VITE_REDIRECT_URI
  const state = crypto.randomUUID()

  sessionStorage.setItem("smart_state", state)
  sessionStorage.setItem("smart_iss", iss)

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    launch: launchToken,
    scope: "launch openid fhirUser offline_access user/Patient.read user/Observation.read user/Observation.write",
    state: state,
    aud: iss
  })

  return `${authEndpoint}?${params.toString()}`
}

export async function exchangeCodeForToken(tokenEndpoint, code) {
  const clientId = import.meta.env.VITE_CLIENT_ID
  const redirectUri = import.meta.env.VITE_REDIRECT_URI

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId
  })

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  })

  if (!response.ok) {
    throw new Error("Token exchange failed")
  }

  const tokenData = await response.json()
  console.log("Token response:", tokenData)
  return tokenData
}
