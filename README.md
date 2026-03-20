# SMART Practitioner App - Cerner

A SMART on FHIR practitioner-facing application built with React + Vite that integrates with the Cerner (Oracle Health) EHR via EHR Launch.

## What It Does
- Initiates EHR Launch flow automatically when opened from Cerner
- Completes full OAuth2 Authorization Code Flow with launch token
- Displays Patient Banner with demographics from FHIR Patient resource
- Lists patient vital signs from FHIR Observation resources
- Writes new temperature observations back to Cerner's FHIR server

## Tech Stack
- React + Vite
- SMART on FHIR v1
- OAuth2 Authorization Code Flow with EHR Launch
- Cerner Millennium FHIR R4 API
- LOINC codes for vital sign observations

## Key Concepts Demonstrated
- EHR Launch vs Standalone Launch
- Dynamic SMART configuration discovery via `.well-known/smart-configuration`
- Launch token binding for patient/encounter context
- CSRF protection via state parameter validation
- Bidirectional FHIR data flow (read + write Observations)
- sessionStorage for auth state persistence across redirects

## Setup
1. Register app at [Cerner Code Console](https://code-console.cerner.com)
2. Clone repo and run `npm install`
3. Create `.env` file:
```
VITE_CLIENT_ID=your_client_id
VITE_REDIRECT_URI=http://localhost:5173
```
4. Run `npm run dev`
5. Launch from Cerner Code Console Test Sandbox

## FHIR Resources Used
- `Patient` - read patient demographics
- `Observation` - read and write vital signs (LOINC 8331-1 oral temperature)