<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1jaXF9XGKgXrVq0aMnijXAULxGX2soaxx

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Maintenance notes

- **Reset demo data:** Log in as the coach, open the **Coach Control** tab, and hit **Reset App Data** to clear demo storage (sessions, bookings, announcements, tips, and the cached login) and reload with a clean slate.
- **Calendar export:** From **Academy Passes** (Bookings), use **Export Calendar** to download an `.ics` file of your confirmed bookings and drop it into Google/Apple/Outlook calendars.
