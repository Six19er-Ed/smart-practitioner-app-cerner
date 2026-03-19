import { useEffect, useState } from "react"
import axios from "axios"

function VitalsList({ refresh }) {
  const [vitals, setVitals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem("smart_token")
    const patientId = sessionStorage.getItem("smart_patient")
    const iss = sessionStorage.getItem("smart_iss")

    axios.get(`${iss}/Observation`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        patient: patientId,
        category: "vital-signs",
        _sort: "-date",
        _count: 20
      }
    })
    .then(res => {
      const entries = res.data.entry?.map(e => e.resource) || []
      setVitals(entries)
      setLoading(false)
    })
    .catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [refresh])

  if (loading) return <p>Loading vitals...</p>
  if (vitals.length === 0) return <p>No vitals found.</p>

  return (
    <div>
      <h2>Vital Signs</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Vital</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Value</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {vitals.map(v => (
            <tr key={v.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "8px" }}>{v.code?.text || v.code?.coding?.[0]?.display}</td>
              <td style={{ padding: "8px" }}>
                {v.valueQuantity
                  ? `${v.valueQuantity.value} ${v.valueQuantity.unit}`
                  : "N/A"}
              </td>
              <td style={{ padding: "8px" }}>{v.effectiveDateTime?.split("T")[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default VitalsList