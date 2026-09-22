# PlantGuard AI

AI-Based Smart Plant Disease Detection System — Mobile-First PWA

You are an expert full-stack engineer, AI integration engineer, PWA developer, UI/UX designer, Firebase developer, and software architect.

Build a complete production-quality college project called:

"AI-Based Smart Plant Disease Detection System"

The application must be a mobile-first Progressive Web App (PWA) that allows a user to use their phone camera to capture a real image of a plant/leaf and obtain a genuine AI-based plant/disease prediction using a FREE AI API.

The project must be lightweight, practical, understandable, demonstrable, and suitable for a college project/viva.

1. ABSOLUTE PROJECT REQUIREMENTS

These requirements are mandatory and must not be changed unless explicitly instructed.

1.1 Real AI only

The system MUST perform actual AI/image analysis.

Do NOT use:

Mock AI

Fake predictions

Random disease names

Random confidence percentages

Hardcoded image-to-disease mappings

Preloaded diagnosis results

Demo-only JSON responses

Fake API responses

if image == ... then disease

Static results pretending to be AI

Every diagnosis shown to the user must originate from an actual image analysis API request.

The basic pipeline must be:

Camera image
→ Backend
→ Real AI API
→ AI prediction
→ Result
→ UI

2. FREE API REQUIREMENT

The project must use FREE API access only.

Do NOT require:

Paid API subscriptions

Paid API credits

Paid AI keys

OpenAI paid API

Google paid AI API

Any mandatory paid service

The primary plant-disease AI service should be:

Pl@ntNet API

Use its free developer/API access where permitted by its current terms and limits.

The current intended use is the Pl@ntNet disease identification API.

Before implementation, verify the current official API documentation and endpoint requirements.

Official documentation:

https://my.plantnet.org/doc/api/diseases

Official pricing:

https://my.plantnet.org/pricing

Do not assume undocumented endpoints.

If the current free API terms or endpoint have changed, STOP and clearly explain the change rather than silently replacing the AI with mock data.

If an alternative FREE plant-disease AI API is needed, it must genuinely analyze uploaded images and must be verified before implementation.

3. NO AUTHENTICATION

There must be NO authentication system.

Do NOT implement:

Login

Signup

Google Login

Email/password authentication

User accounts

Password reset

Profiles

User sessions

The application must open directly.

User flow:

Open PWA
→ Home
→ Scan Plant
→ Camera
→ AI analysis
→ Result

No login should interrupt this process.

4. CORE TECHNOLOGY STACK

Use this stack unless there is a compelling technical reason to change something.

Frontend

React

Vite

JavaScript or TypeScript

Tailwind CSS

React Router

vite-plugin-pwa

Prefer TypeScript if it does not unnecessarily complicate the project.

Camera

Use the native browser:

MediaDevices.getUserMedia()

Do not introduce a large camera library unless absolutely necessary.

The application must request the rear/environment-facing camera on supported mobile devices.

Backend

Use:

Node.js

Express

The backend should be intentionally small.

Its primary purpose is to securely communicate with the AI API without exposing the API key to the frontend.

AI

Primary:

Pl@ntNet disease identification API — FREE access

The AI API must receive the actual captured image.

Firebase

Use Firebase only for necessary application data.

Use:

Firebase Firestore

Firebase Hosting

Firebase Authentication must NOT be used.

Firebase Storage is NOT required for the first version.

Do not permanently store user images unless explicitly requested later.

Hosting

Use Firebase Hosting for the PWA.

5. HIGH-LEVEL ARCHITECTURE

Implement this architecture:

                         USER
                          |
                          v
                 +------------------+
                 |    MOBILE PWA    |
                 |                  |
                 | React + Vite     |
                 | Tailwind         |
                 | PWA              |
                 +--------+---------+
                          |
                          | HTTPS
                          v
                 +------------------+
                 | LIGHT BACKEND    |
                 |                  |
                 | Node.js          |
                 | Express          |
                 +--------+---------+
                          |
                          | API Key
                          v
                 +------------------+
                 |    Pl@ntNet      |
                 |     AI API       |
                 |                  |
                 | Image Analysis   |
                 | Plant/Disease    |
                 | Confidence       |
                 +--------+---------+
                          |
                          v
                 +------------------+
                 |    FIREBASE      |
                 |                  |
                 | Firestore        |
                 | Hosting          |
                 +------------------+


The diagnosis MUST come from Pl@ntNet.

Firebase must NOT determine the disease.

6. CORE USER FLOW

Implement the complete flow below.

Step 1 — Open application

User opens the PWA.

No login.

Show the Home screen.

Step 2 — Start scan

User presses:

"Scan Plant"

Step 3 — Camera permission

Request camera permission.

Prefer:

facingMode: "environment"


for the rear camera.

Handle permission denial gracefully.

Example:

"Camera access is required to scan a plant."

Provide an option to retry.

Step 4 — Camera preview

Display a full mobile camera interface.

Show a scanning guide.

Example:

"Place the affected leaf inside the frame."

Do NOT automatically claim that the object is a leaf unless the AI confirms it.

Step 5 — Capture

User presses the capture button.

Capture an image from the video stream.

Allow:

Retake

Analyze

Step 6 — Image preprocessing

Before sending the image:

Validate the image

Resize if excessively large

Compress to reasonable JPEG quality

Preserve enough detail for disease recognition

Do not destroy important leaf details.

Step 7 — Send to backend

Send the actual image to:

POST /api/plant/analyze


Use:

multipart/form-data

with:

image


Step 8 — Backend

Backend:

Receive image

Validate MIME type

Validate size

Reject invalid files

Forward image to Pl@ntNet

Receive actual AI response

Normalize response

Return structured JSON to frontend

Step 9 — AI result

The API result must be interpreted from the real response.

Do not invent fields.

If the API returns confidence/score, use the actual value.

Step 10 — Display result

Show:

Plant name if available

Disease name

Confidence

Alternative predictions if useful

AI status

Symptoms/reference information

Recommendation

Prevention

Step 11 — Firebase

Store useful scan/result metadata in Firestore if scan history is enabled.

Do NOT require authentication.

Do NOT store passwords or user identity.

Do NOT make Firebase responsible for AI diagnosis.

7. IMPORTANT AI RESULT RULE

Never force a diagnosis.

If the AI:

Rejects the image

Cannot identify the plant

Returns no disease

Returns an unusable response

Has insufficient confidence

Encounters an API error

then show an appropriate message.

Example:

Unable to make a reliable diagnosis.

Please try again with:
• A clear leaf image
• Good lighting
• The affected area visible
• Less background
• The camera focused on the leaf


Never replace an unsuccessful AI response with a fake disease.

8. CONFIDENCE HANDLING

Use the actual confidence/score returned by the API.

Do not fabricate confidence.

Do not modify it simply to make the demo look better.

Convert to percentage only when mathematically appropriate.

For example:

0.94 → 94%


Use application-level presentation states such as:

High confidence
Medium confidence
Low confidence


but clearly distinguish these UI labels from official model accuracy.

Suggested initial UI thresholds:

>= 0.80 → High confidence
0.60–0.79 → Medium confidence
< 0.60 → Low confidence


These thresholds are only UX rules and must not be presented as scientific accuracy claims.

If the API provides a different confidence interpretation, follow the API documentation instead.

9. AI RESULT SCREEN

Create a visually polished result page.

Example:

+--------------------------------+
| ← Scan Result                  |
|                                |
|        [LEAF IMAGE]             |
|                                |
| 🌱 Plant                       |
| Tomato                         |
|                                |
| 🦠 Detected Condition          |
| Early Blight                   |
|                                |
| 🎯 Confidence                  |
| 94%                            |
| ████████████████░░             |
|                                |
| ------------------------------ |
|                                |
| Symptoms                       |
| Brown/irregular leaf lesions   |
|                                |
| Recommended Action             |
| Remove severely affected       |
| leaves and improve airflow.    |
|                                |
| Prevention                     |
| Avoid prolonged leaf wetness.  |
|                                |
|                                |
|       [ Scan Again ]            |
+--------------------------------+


Do not use this exact text unless supported by the actual disease information source.

10. FIREBASE ARCHITECTURE

Use Firestore for application/reference data.

Do not add Firebase Authentication.

Suggested structure:

diseaseInformation/
    {diseaseId}/
        name
        symptoms
        treatment
        prevention
        description

scans/
    {scanId}/
        plantName
        diseaseName
        confidence
        createdAt


Because there is no authentication, do not store:

userId
email
password
profile


unless there is a future explicit requirement.

11. DISEASE INFORMATION

Separate:

AI diagnosis

This comes from the real AI API.

Example:

AI:
Tomato
Early Blight
0.94


Reference information

Firebase can provide:

Symptoms
Treatment
Prevention
Description


This is NOT the diagnosis.

Never create a hardcoded mapping like:

Tomato → Early Blight


The AI must decide the disease.

Firebase only provides information associated with a disease that the AI has already identified.

12. MOBILE-FIRST DESIGN

This is a mobile application experience first.

Do NOT design a desktop dashboard and simply shrink it.

Primary target:

Android smartphone browser/PWA

Design around:

360px

390px

412px

430px

Use responsive behavior for larger screens, but mobile must remain the priority.

The interface should feel like a native mobile app.

13. PWA REQUIREMENTS

Implement a complete PWA.

Include:

Web app manifest

App name

Short name

Icons

Theme color

Start URL

Display mode

Service worker

Installability

Offline application shell

The application should be installable from a compatible mobile browser.

Offline mode should NOT pretend that AI analysis works offline.

If the device has no internet connection:

AI analysis requires an internet connection.
Please reconnect and try again.


Do not fake offline predictions.

14. MAIN SCREENS

Build these screens.

Screen 1 — Home

Content:

🌱 Smart Plant AI

AI-powered plant disease detection

[ Scan Plant ]

How it works

1. Capture a leaf
2. AI analyzes it
3. Get the result


Add a clear disclaimer:

"AI predictions are informational and may not replace advice from an agricultural expert."

Screen 2 — Scanner

Features:

Live camera

Rear camera

Scan frame

Capture button

Flash/torch if browser/device supports it

Retake

Analyze

Screen 3 — Analyzing

Show actual progress state:

Analyzing your plant...

Sending image for AI analysis


Do not fake a percentage progress bar.

Use an indeterminate loading animation.

Screen 4 — Result

Show:

Image

Plant

Disease

Confidence

Alternative results

Information

Recommendation

Prevention

Scan Again

Screen 5 — History

If scan history is implemented:

Recent Scans

Tomato
Early Blight
94%
Today

Chilli
...


History must be based on actual Firestore records.

No fake history.

Screen 6 — About

Explain:

What the system does

AI-based analysis

API used

Firebase

Limitations

Disclaimer

15. NAVIGATION

Use a simple mobile navigation.

Suggested:

Home
Scan
History
About


Bottom navigation:

┌───────────────────────────────┐
│  🏠       📷       📋      ℹ️ │
│ Home      Scan    History  About
└───────────────────────────────┘


The Scan button should be visually prominent.

16. UI/UX DESIGN

Style should be:

Clean

Modern

Nature-inspired

Professional

Minimal

Easy to understand

College-project appropriate

Use:

Rounded cards

Soft shadows

Clear typography

Large touch targets

Accessible contrast

Simple icons

Avoid:

Overly complex animations

Heavy 3D graphics

Giant dashboards

Excessive gradients

Desktop-only layouts

Unnecessary components

17. CAMERA UX

Scanner should clearly tell the user:

For better results:

✓ Use good lighting
✓ Keep the leaf in focus
✓ Show the affected area
✓ Avoid excessive background
✓ Keep the camera steady


Do not guarantee accuracy.

18. IMAGE VALIDATION

Before API submission:

Allowed:

image/jpeg
image/png
image/webp


If Pl@ntNet supports a narrower set for the selected endpoint, convert to the supported format.

Reject:

PDFs

Videos

Executables

Unsupported files

Set a reasonable maximum image size.

Show:

Image is too large.
Please try again.


19. BACKEND API

Create:

GET /api/health


Response:

{
  "status": "ok"
}


Create:

POST /api/plant/analyze


Request:

multipart/form-data
image=<file>


Response should use a normalized structure similar to:

{
  "success": true,
  "plant": {
    "name": "..."
  },
  "diagnosis": {
    "name": "...",
    "confidence": 0.94
  },
  "alternatives": [],
  "source": "plantnet"
}


Only populate fields that are actually supported by the API response.

Do not invent scientific names, confidence, severity, or diagnosis.

20. BACKEND ERROR HANDLING

Handle:

400
401
403
413
429
500
502
503
504


Examples:

Invalid image

Please upload a valid plant image.


API quota exceeded

AI service limit reached.
Please try again later.


AI service unavailable

The AI service is temporarily unavailable.
Please try again.


Timeout

Analysis took too long.
Please check your connection and try again.


Unknown response

We couldn't interpret the AI response.
Please try another image.


Never fall back to fake data.

21. API SECURITY

Never expose the Pl@ntNet API key in React.

Do NOT put it in:

VITE_PLANTNET_API_KEY


because frontend environment variables are bundled into client-side code.

Instead:

React
 ↓
Express backend
 ↓
PLANTNET_API_KEY
 ↓
Pl@ntNet


Store secrets in backend environment variables.

Example:

PLANTNET_API_KEY=your_key_here


Never commit .env.

Create:

.env.example


containing:

PLANTNET_API_KEY=
PORT=
FIREBASE_PROJECT_ID=


Do not include real keys.

22. FIREBASE SECURITY

Because there is no authentication, carefully consider Firestore rules.

Do not create completely unrestricted production rules such as:

allow read, write: if true;


unless absolutely necessary for a temporary local prototype.

Prefer read-only public disease/reference data where possible.

For scan history, if anonymous unauthenticated writing is required, design strict validation and rate-limiting considerations.

Do not expose sensitive information.

Do not store personal information.

23. SCAN HISTORY

Scan history is optional but recommended.

Since authentication is forbidden, history should not be presented as an account-based feature.

Possible approach:

Local device history
+
Firestore application records if needed


If Firestore history creates unnecessary security complexity, prioritize the core AI scan feature and keep history local using browser storage.

Do not compromise security simply to have a history page.

24. NO IMAGE STORAGE IN V1

Do not permanently upload every scanned image to Firebase Storage.

The first version should:

Camera
 ↓
AI API
 ↓
Result
 ↓
Optional metadata/history


The actual image can remain temporary.

This reduces:

Cost

Privacy concerns

Firebase complexity

Storage requirements

If image storage is added later, it must be explicitly designed.

25. REAL-TIME REQUIREMENT

"Real-time" means:

Every scan must be dynamically analyzed.

The system must NOT retrieve a preloaded answer based on an existing image.

Correct:

NEW CAMERA IMAGE
      ↓
REAL API REQUEST
      ↓
AI ANALYSIS
      ↓
NEW RESULT


Incorrect:

Camera
 ↓
Search database
 ↓
Preloaded result


For V1, use:

capture → analyze → result

Do not implement continuous frame-by-frame inference unless specifically requested later.

26. NETWORK STATES

Handle:

Online

Normal AI scan.

Offline

You're offline.
AI plant analysis requires an internet connection.


Slow connection

Show:

Analyzing...
This may take a few moments.


API quota

Show a useful error.

Never provide a fake result.

27. ACCESSIBILITY

Implement:

Semantic HTML

Accessible buttons

Proper labels

Keyboard support

Good contrast

Focus states

aria-label where necessary

Touch targets at least approximately 44px

Meaningful error messages

28. PERFORMANCE

Keep the project lightweight.

Avoid:

Large UI libraries

Huge state-management libraries

Heavy ML packages

TensorFlow.js

PyTorch

Python ML server

GPU requirements

Kubernetes

Microservices

Complex Docker infrastructure

The frontend should load quickly on mobile networks.

Compress images before sending them.

Lazy-load non-critical pages if useful.

29. STATE MANAGEMENT

Do not use Redux unless actually necessary.

Use:

React state

React Context only when useful

Custom hooks

Examples:

useCamera()
usePlantScan()
useFirestore()


Keep state simple.

30. RECOMMENDED FRONTEND STRUCTURE

Use:

frontend/
├── public/
│   ├── icons/
│   └── favicon/
│
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── CameraScanner.jsx
│   │   ├── ScanGuide.jsx
│   │   ├── CaptureButton.jsx
│   │   ├── ResultCard.jsx
│   │   ├── ConfidenceBar.jsx
│   │   ├── DiseaseInfo.jsx
│   │   ├── LoadingAnalysis.jsx
│   │   └── ErrorState.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Scanner.jsx
│   │   ├── Result.jsx
│   │   ├── History.jsx
│   │   └── About.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── firebase.js
│   │   └── firestore.js
│   │
│   ├── hooks/
│   │   ├── useCamera.js
│   │   └── usePlantScan.js
│   │
│   ├── utils/
│   │   ├── image.js
│   │   ├── confidence.js
│   │   └── validation.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── vite.config.js
└── package.json


31. RECOMMENDED BACKEND STRUCTURE

backend/
├── src/
│   ├── routes/
│   │   └── plantRoutes.js
│   │
│   ├── controllers/
│   │   └── plantController.js
│   │
│   ├── services/
│   │   └── plantnetService.js
│   │
│   ├── middleware/
│   │   ├── upload.js
│   │   └── errorHandler.js
│   │
│   ├── utils/
│   │   └── response.js
│   │
│   └── server.js
│
├── .env
├── .env.example
└── package.json


32. API SERVICE DESIGN

Create a dedicated service:

plantnetService.js


It should:

Accept image buffer/file

Build the correct multipart request

Send request to the official Pl@ntNet API endpoint

Include API key securely

Handle timeout

Handle API errors

Parse response

Return normalized data

Do not mix API calls directly into React components.

33. FIREBASE SERVICE DESIGN

Create:

firebase.js
firestore.js


Keep Firebase configuration isolated.

Use environment variables for public Firebase configuration where appropriate.

Do not confuse Firebase client configuration with secret API credentials.

34. DATABASE RESPONSIBILITY

Firestore is NOT the AI.

Firestore should store:

Disease reference information

Optional scan metadata

Optional local/history synchronization data

It should NOT contain a preloaded list that determines:

image → disease


The actual AI prediction must originate from the AI API.

35. SUPPORTED PLANTS

Do not claim:

"Detects every plant in the world."

Instead, use the actual plants/diseases supported by the chosen API.

Before finalizing the project, inspect the current official Pl@ntNet disease API documentation and supported species/pathologies.

Create a clear "Supported Plants" or "Coverage" section if appropriate.

Example:

Supported plants and diseases depend on
the current AI provider's disease model.


Only list verified supported species.

36. DISCLAIMER

Add this to the About/result interface:

AI Disclaimer

This application provides AI-based plant disease
predictions for educational and informational purposes.
Results may be incorrect, especially when image quality
is poor or the plant/disease is outside the supported
coverage of the AI system.

For serious crop damage, consult a qualified agricultural
expert.


Do not make medical/agricultural guarantees.

37. PROJECT HOME PAGE COPY

Use professional wording.

Suggested:

Smart Plant AI

Detect plant health problems using
AI-powered image analysis.

Capture a clear photo of a plant leaf
and let the AI analyze it.

[ Scan Plant ]

How it works

📷 Capture
Take a clear picture of the affected leaf.

🤖 Analyze
Our AI service analyzes the image.

🌱 Understand
View the predicted plant disease,
confidence, and useful information.


Do not claim 100% accuracy.

38. RESULT COPY

Do not say:

"Your plant definitely has..."

Say:

"AI Prediction"

or:

"Likely condition"

Example:

AI Prediction

Tomato Early Blight

94% confidence


If low confidence:

Low-confidence prediction

The AI could not make a reliable diagnosis.
Please capture another clear image.


39. LOADING EXPERIENCE

When analyzing:

Analyzing plant...

Your image is being analyzed by the
plant disease AI service.


Use a spinner/skeleton.

Do not display fake progress:

10%
20%
30%
...


unless actual progress is available.

40. CAMERA RESOURCE MANAGEMENT

When leaving the scanner page:

Stop all camera tracks

Release the camera

Clear video stream

Avoid camera staying active in background

Example concept:

stream.getTracks().forEach(track => track.stop())


Implement cleanup correctly.

41. ERROR RESILIENCE

The application should never crash because:

Camera denied

API unavailable

Network unavailable

Invalid image

AI returns no result

Firebase unavailable

Unexpected API response

Show user-friendly states.

Log technical errors safely for development, but don't expose secrets.

42. API RATE LIMITING

Because the free API has a daily limit, avoid unnecessary calls.

Only call the AI when the user explicitly presses:

Analyze

Do NOT automatically send every camera frame.

Prevent accidental duplicate requests while one scan is already running.

Disable the Analyze button during processing.

43. DUPLICATE REQUEST PROTECTION

During analysis:

isAnalyzing = true


Disable:

Analyze

Capture

Duplicate submission

After completion:

isAnalyzing = false


44. IMAGE PRIVACY

Explain:

"The captured image is sent to the AI service for analysis."

Do not claim the image is never transmitted.

Do not silently retain images longer than necessary.

Do not upload images to Firebase unless explicitly required.

45. TESTING REQUIREMENTS

Test with real images.

Test at minimum:

Healthy leaf

Expected:

AI should return whatever the API actually determines.

Diseased leaf

Expected:

Actual disease prediction if supported.

Blurry image

Expected:

Potential low-confidence/error/rejection.

Dark image

Expected:

Potential poor result.

Non-plant object

Expected:

Rejection or unsuitable result where supported.

Unsupported plant

Expected:

No reliable diagnosis or appropriate API response.

Internet disconnected

Expected:

No fake result.

API unavailable

Expected:

Error state.

Camera permission denied

Expected:

Permission guidance.

46. NO MOCK DATA POLICY DURING TESTING

Do not create:

mockResults.js
fakeDiseases.json
demoPrediction.json


unless explicitly used for isolated UI unit tests and clearly separated from production logic.

The actual application must always call the real API.

For development, if the API is unavailable, show:

AI service unavailable.


Do not substitute fake predictions.

47. DEVELOPMENT ENVIRONMENT

Requirements:

Node.js LTS

npm

modern browser

Firebase project

Pl@ntNet developer/API access

For camera testing on a phone, use HTTPS or an appropriate secure development environment.

localhost camera behavior differs between desktop and physical devices.

Document how to test on an Android phone.

48. LOCAL DEVELOPMENT

Frontend:

npm install
npm run dev


Backend:

npm install
npm run dev


Use separate ports during development.

Example:

Frontend:
http://localhost:5173

Backend:
http://localhost:5000


Configure CORS appropriately for development.

Do not use cors: * blindly in production.

49. ENVIRONMENT VARIABLES

Frontend:

VITE_API_BASE_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=


Do NOT put the Pl@ntNet secret key here.

Backend:

PORT=5000
PLANTNET_API_KEY=


If additional backend Firebase Admin credentials are required, keep them server-side and never commit them.

50. DEPLOYMENT

Deployment architecture:

Firebase Hosting
        ↓
React PWA
        ↓
Backend API
        ↓
Pl@ntNet


If Node/Express cannot conveniently be hosted in the selected Firebase hosting configuration, use a lightweight free-compatible backend hosting option, but do not introduce a paid requirement.

Before deployment, verify the current free-tier policies of the chosen backend host.

Do not tell the user that a service is free without verifying its current pricing.

51. PROJECT README

Create a detailed README containing:

Project title

AI-Based Smart Plant Disease Detection System

Description

Features

Technology stack

Architecture

Installation

Environment variables

Firebase setup

Pl@ntNet API setup

Running frontend

Running backend

Mobile testing

PWA installation

Deployment

API limitations

Supported plant/disease coverage

Privacy

Disclaimer

Future improvements

52. COLLEGE PROJECT DOCUMENTATION

The project should be structured so that it can be explained during a viva.

Prepare explanations for:

Problem statement

Farmers and plant owners may have difficulty identifying plant diseases from visible symptoms.

Proposed solution

A mobile-first AI application that analyzes plant images and provides a disease prediction.

Existing system

Manual identification and expert consultation.

Proposed system

Camera-based AI image analysis.

Advantages

Easy to use

Mobile friendly

AI-powered

Real-time image analysis

No specialized hardware

Fast response

Lightweight architecture

Limitations

Internet connection required

AI API dependency

Free API quota

Supported plant/disease coverage

Image quality affects results

AI prediction is not guaranteed to be correct

53. PROJECT MODULES

Use these modules in documentation:

Module 1

Mobile PWA Interface

Module 2

Camera Capture

Module 3

Image Preprocessing

Module 4

AI Plant/Disease Detection

Module 5

Confidence Analysis

Module 6

Disease Information

Module 7

Firebase Data Management

Module 8

PWA/Deployment

54. DATA FLOW

Document the following:

User
 ↓
Camera
 ↓
Image Capture
 ↓
Image Validation
 ↓
Image Compression
 ↓
Frontend API Request
 ↓
Node/Express Backend
 ↓
Pl@ntNet AI
 ↓
AI Prediction
 ↓
Backend Normalization
 ↓
Frontend
 ↓
Firebase Reference Data
 ↓
Result Screen


55. SECURITY FLOW

User
 ↓
React PWA
 ↓
Backend
 ↓
Secret API key
 ↓
Pl@ntNet


Never:

User
 ↓
React
 ↓
Secret API key
 ↓
Pl@ntNet


56. PERFORMANCE TARGET

Aim for:

Fast initial load

Small JavaScript bundle

Compressed images

No unnecessary API calls

No continuous AI requests

Proper loading states

Mobile network compatibility

Do not optimize prematurely with complicated infrastructure.

57. FUTURE FEATURES

Do NOT implement these in V1 unless explicitly requested:

Continuous live video AI inference

Voice assistant

Drone integration

IoT sensors

Weather prediction

Fertilizer optimization

Disease outbreak prediction

Huge local ML model

Farmer social network

Chatbot

Marketplace

Payment system

Authentication

Admin dashboard

They may be mentioned as future enhancements in documentation.

58. OPTIONAL FUTURE AI FEATURES

Possible future versions:

Live continuous scanning
Multiple leaf images
Plant growth monitoring
Disease severity estimation
Weather-aware recommendations
AI agricultural assistant
Regional crop disease trends


But keep V1 focused.

59. CRITICAL DESIGN PRINCIPLE

Do not over-engineer.

This is a college project.

The ideal architecture is:

React PWA
    +
Node/Express
    +
FREE AI API
    +
Firebase


Nothing more unless necessary.

60. DO NOT USE HEAVY ML

Do NOT implement:

TensorFlow server

PyTorch server

Custom neural network

GPU inference

Model training pipeline

Model hosting

CUDA

Large model files

The AI inference is performed by the external AI API.

61. DO NOT FAKE AI

This is the most important instruction.

If the real API does not support a plant:

DO NOT fake support.

If the API returns no disease:

DO NOT invent one.

If confidence is low:

DO NOT increase it.

If the API is unavailable:

DO NOT use mock results.

If free API quota is exhausted:

DO NOT use fake data.

The application must honestly report the situation.

62. API DOCUMENTATION VERIFICATION

Before coding the AI integration:

Open the official Pl@ntNet API documentation.

Verify the current disease endpoint.

Verify authentication method.

Verify image format.

Verify request fields.

Verify response structure.

Verify confidence field.

Verify supported species/pathologies.

Verify free quota.

Verify current usage restrictions.

Do not implement based on outdated examples.

63. IMPLEMENTATION ORDER

Build in this exact sequence.

STEP 1

Initialize repository.

STEP 2

Create React/Vite frontend.

STEP 3

Configure Tailwind.

STEP 4

Configure PWA.

STEP 5

Create basic mobile navigation.

STEP 6

Build Home screen.

STEP 7

Implement camera.

STEP 8

Implement capture/retake.

STEP 9

Build Node/Express backend.

STEP 10

Implement /api/health.

STEP 11

Implement /api/plant/analyze.

STEP 12

Connect Pl@ntNet.

STEP 13

Test with real plant images.

STEP 14

Build result screen.

STEP 15

Implement confidence handling.

STEP 16

Configure Firebase.

STEP 17

Add Firestore disease information.

STEP 18

Add optional scan history.

STEP 19

Implement error states.

STEP 20

Implement PWA installation.

STEP 21

Test on Android.

STEP 22

Optimize performance.

STEP 23

Deploy.

STEP 24

Write documentation.

64. ACCEPTANCE CRITERIA

The project is considered complete only when all of the following work:

Camera

Rear camera opens on supported phones

Permission handled

Capture works

Retake works

Camera stops when leaving scanner

AI

Actual image sent to real AI API

No mock prediction

Actual disease response displayed

Actual confidence displayed

API errors handled

Low-confidence state handled

Unsupported images handled

Firebase

Firestore configured

Disease information works

No authentication

No unnecessary personal data

PWA

Installable

Manifest configured

Icons configured

Service worker configured

Mobile-first layout

Security

AI API key never exposed in frontend

.env ignored

No credentials committed

Firebase rules configured

UX

Loading state

Error state

Empty state

Result state

Responsive mobile UI

Accessible controls

65. FINAL EXPECTED USER EXPERIENCE

The final application should feel like:

             🌱 SMART PLANT AI

                    ↓

              [ Scan Plant ]

                    ↓

              📷 CAMERA

                    ↓

              [ Capture ]

                    ↓

             [ Analyze ]

                    ↓

          🤖 AI ANALYZING...

                    ↓

       ┌───────────────────────┐
       │      AI RESULT        │
       │                       │
       │ 🌱 Tomato             │
       │                       │
       │ 🦠 Early Blight       │
       │                       │
       │ 🎯 94% confidence     │
       │                       │
       │ Symptoms              │
       │ ...                   │
       │                       │
       │ Recommended Action    │
       │ ...                   │
       │                       │
       │ Prevention            │
       │ ...                   │
       │                       │
       │ [ Scan Again ]        │
       └───────────────────────┘


The result must be generated from the image captured in that scan.

66. FINAL ARCHITECTURE TO IMPLEMENT

                         ┌───────────────┐
                         │    MOBILE     │
                         │     USER      │
                         └───────┬───────┘
                                 │
                                 ▼
                    ┌──────────────────────┐
                    │      REACT PWA       │
                    │                      │
                    │ Home                 │
                    │ Camera               │
                    │ Result               │
                    │ History              │
                    │ About                │
                    └──────────┬───────────┘
                               │
                               │ HTTPS
                               ▼
                    ┌──────────────────────┐
                    │    NODE + EXPRESS    │
                    │                      │
                    │ /api/health          │
                    │ /api/plant/analyze   │
                    └──────────┬───────────┘
                               │
                               │ Secure API key
                               ▼
                    ┌──────────────────────┐
                    │      Pl@ntNet        │
                    │       AI API         │
                    │                      │
                    │ Real image analysis  │
                    │ Disease prediction   │
                    │ Confidence           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FIREBASE        │
                    │                      │
                    │ Firestore            │
                    │ Disease information  │
                    │ Optional history     │
                    │ Hosting              │
                    └──────────────────────┘


67. FINAL RULE

Always prioritize these requirements in this exact order:

Real AI result

FREE AI API

No fake/mock data

Mobile-first PWA

Camera-based scanning

Firebase

No authentication

Lightweight architecture

Security

Good UI/UX

Do not sacrifice the first three requirements for convenience.

If an implementation cannot satisfy them, explain the limitation honestly and propose a free alternative rather than silently implementing a fake solution.

Now begin the project systematically, starting with verification of the current free Pl@ntNet API and its supported disease endpoint, then scaffold the project, and proceed phase-by-phase.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/20f166e3-a1eb-49b4-be8c-f342ee927960).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
