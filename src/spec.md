# Specification

## Summary
**Goal:** Rebrand the existing library application into an agriculture-focused website for Indian farmers, with core farming modules, admin management, multilingual (English/Hindi) support, and offline-friendly behavior.

**Planned changes:**
- Update public homepage, header branding, navigation labels, and icons to agriculture-focused sections: Weather, Crop Advisory, Mandi Prices, Government Schemes, Soil Health, and Expert Support.
- Apply an agriculture visual theme (earthy greens/soil browns/sky-blue accents, high-contrast, rounded cards) across the public site and admin dashboard without modifying any sources under `frontend/src/components/ui`.
- Add public module pages/sections with list + detail (or expandable details) for Weather (current + 7-day), Crop Advisory, Mandi Prices (daily + comparison), Government Schemes, Soil Health records, and Expert Support submissions.
- Replace library backend models/APIs with agriculture-domain models and endpoints for farmer profiles, crops/advisories, mandi prices, schemes, soil reports, and expert queries; enforce authorization (public read for info; authenticated submissions; admin-only content management).
- Update admin dashboard to manage crop advisories, mandi prices, government schemes, and an expert query review/response workflow (respond + mark resolved).
- Implement English/Hindi multilingual UI with a language selector and persistent preference (saved to authenticated user profile and cached locally).
- Add offline/low-bandwidth behavior by caching last successfully loaded module data client-side and showing an offline/cached-data indicator when fresh fetches fail.
- Add image upload in Crop Advisory to attach a photo to an expert query for manual review; persist image data with the query; allow admins to view attachments; enforce a maximum image size with clear UI errors.
- Update React Query hooks in `frontend/src/hooks/useQueries.ts` to remove library-specific hooks and replace them with agriculture-domain hooks aligned to the new backend APIs; refactor pages/components accordingly.
- Provide a backend data migration approach for upgrading from library state to the new agriculture schema (reset/initialize if needed while preserving admin authorization where possible).

**User-visible outcome:** Users see an agriculture website (English or Hindi) with modules for weather, crop advice, mandi prices, schemes, soil health tracking, and expert support (including photo attachments), that remains usable in low connectivity by showing cached data; admins can manage agriculture content and respond to farmer queries in the dashboard.
