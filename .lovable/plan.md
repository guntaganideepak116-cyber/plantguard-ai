# Smart Plant AI build plan

## Product scope
- Replace the placeholder home screen with a mobile-first Smart Plant AI experience.
- Add Home, Scan, History, and About views with bottom navigation and a native camera flow.
- Keep authentication out of the project and never invent a diagnosis, confidence score, or history item.

## AI and scan flow
- Implement camera permission handling with the rear-facing camera, capture, retake, image validation, client-side JPEG compression, and camera cleanup.
- Add a real `POST /api/plant/analyze` server endpoint that accepts the captured image and forwards it to the documented Pl@ntNet disease endpoint using a server-only API key.
- Normalize only fields present in the provider response and show honest unavailable, low-confidence, quota, and network states.

## PWA and presentation
- Add installable PWA metadata, icons, and guarded offline shell caching; explicitly prevent offline analysis claims.
- Establish a nature-inspired semantic design system, then build accessible, touch-friendly mobile-first screens with a responsive desktop shell.
- Use local device metadata history only when a real analysis succeeds; do not persist images.

## Documentation and validation
- Add `.env.example` and a README covering the API key setup, local testing, camera constraints, PWA behavior, data flow, limitations, and viva modules.
- Verify the official API documentation, run the project build, and exercise public UI states in the live preview.

## Technical notes
- This repository is TanStack Start, so the secure API endpoint will use its server route mechanism rather than adding a second Express runtime.
- Firebase is not connected in this workspace; no fake Firebase integration will be added. The app will remain usable without authentication and will use local history until a real Firebase project is supplied.
