import PatientBanner from "./components/PatientBanner"
import VitalsList from "./components/VitalsList"
import { fetchSmartConfig, buildAuthUrl, exchangeCodeForToken } from "./utils/auth"
import { useEffect, useState } from "react"
import VitalsForm from "./components/VitalsForm"
function App() {
  const [appState, setAppState] = useState("idle")
  const [tokenData, setTokenData] = useState(null)
  const [refresh, setRefresh] = useState(0)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const iss = params.get("iss")
    const launch = params.get("launch")
    const code = params.get("code")
    const state = params.get("state")

    if (iss && launch) {
      setAppState("launching")
      fetchSmartConfig(iss)
        .then(config => {
          sessionStorage.setItem("smart_token_endpoint", config.token_endpoint)
          const authUrl = buildAuthUrl(config.authorization_endpoint, iss, launch)
          window.location.href = authUrl
        })
        .catch(err => console.error(err))

    } else if (code && state) {
      const savedState = sessionStorage.getItem("smart_state")
      const tokenEndpoint = sessionStorage.getItem("smart_token_endpoint")

      if (state !== savedState) {
        console.error("State mismatch! Possible CSRF attack.")
        setAppState("error")
        return
      }

      setAppState("exchanging")
      exchangeCodeForToken(tokenEndpoint, code)
        .then(data => {sessionStorage.setItem("smart_token", data.access_token)
          sessionStorage.setItem("smart_patient", data.patient)
          sessionStorage.setItem("smart_encounter", data.encounter)
          setTokenData(data)
          setAppState("ready")
          console.log("Patient ID:", data.patient)
        })
        .catch(err => console.error(err))
    } else {
      setAppState("idle")
    }
  }, [])

  return (
    <div style={{ padding: "20px" }}>
    <h1>SMART Practitioner App - Cerner</h1>
    {appState === "ready" && <PatientBanner />}
{appState === "ready" && <VitalsForm onVitalAdded={() => setRefresh(r => r + 1)} />}
{appState === "ready" && <VitalsList refresh={refresh} />}
  </div>
  )
}

export default App