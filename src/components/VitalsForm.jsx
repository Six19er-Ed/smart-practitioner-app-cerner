import { useState } from "react"
import axios from "axios"

function VitalsForm({ onVitalAdded }) {
  const [temperature, setTemperature] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  function handleSubmit() {
    if (!temperature) return

    const token = sessionStorage.getItem("smart_token")
    const patientId = sessionStorage.getItem("smart_patient")
    const iss = sessionStorage.getItem("smart_iss")

    const observation = {
      resourceType: "Observation",
      status: "final",
      category: [{
        coding: [{
          system: "http://terminology.hl7.org/CodeSystem/observation-category",
          code: "vital-signs",
          display: "Vital Signs"
        }]
      }],
      code: {
        coding: [{
          system: "http://loinc.org",
          code: "8331-1",
          display: "Oral temperature"
        }],
        text: "Oral temperature"
      },
      subject: {
        reference: `Patient/${patientId}`
      },
      encounter: {
        reference: `Encounter/${sessionStorage.getItem("smart_encounter")}`
      },
      effectiveDateTime: new Date().toISOString(),
      valueQuantity: {
        value: parseFloat(temperature),
        unit: "degC",
        system: "http://unitsofmeasure.org",
        code: "Cel"
      }
    }

    setSubmitting(true)
    axios.post(`${iss}/Observation`, observation, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/fhir+json"
      }
    })
    .then(() => {
      setMessage("Temperature recorded successfully!")
      setTemperature("")
      setSubmitting(false)
      onVitalAdded()
    })
    .catch(err => {
      console.error(err)
      setMessage("Error recording temperature.")
      setSubmitting(false)
    })
  }

  return (
    <div style={{ margin: "20px 0", padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Record Temperature</h2>
      <input
        type="number"
        placeholder="Temperature (degC)"
        value={temperature}
        onChange={e => setTemperature(e.target.value)}
        style={{ padding: "8px", marginRight: "8px", width: "200px" }}
      />
      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{ padding: "8px 16px", background: "#0066cc", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
      >
        {submitting ? "Saving..." : "Record"}
      </button>
      {message && <p style={{ color: "green", marginTop: "8px" }}>{message}</p>}
    </div>
  )
}

export default VitalsForm