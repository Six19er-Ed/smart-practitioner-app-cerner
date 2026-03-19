import { useEffect, useState } from "react"
import axios from "axios"

function PatientBanner() {
  const [patient, setPatient] = useState(null)

  useEffect(() => {
    const token = sessionStorage.getItem("smart_token")
    const patientId = sessionStorage.getItem("smart_patient")
    const iss = sessionStorage.getItem("smart_iss")

    axios.get(`${iss}/Patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPatient(res.data))
    .catch(err => console.error(err))
  }, [])

  if (!patient) return <p>Loading patient...</p>

  const name = patient.name?.[0]
  const fullName = `${name?.given?.join(" ")} ${name?.family}`

  return (
    <div style={{ background: "#e8f4f8", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
      <h2>{fullName}</h2>
      <p>DOB: {patient.birthDate}</p>
      <p>Gender: {patient.gender}</p>
      <p>Patient ID: {patient.id}</p>
    </div>
  )
}

export default PatientBanner