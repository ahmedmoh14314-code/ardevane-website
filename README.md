# Ardevane

The guest website of a mountain cabin resort. Guests browse the cabins, pick their dates, reserve, and manage their stays. It shares one database with [Ardevane Operations](https://github.com/ahmedmoh14314-code/ardevane-operations), the dashboard the front desk uses, so a booking made here shows up there straight away.

## What guests can do

- **Browse cabins** by size, each with its photo gallery, nightly price and any discount.
- **Pick dates on a calendar** that already greys out taken nights and follows the hotel's rules for the shortest and longest stay.
- **Reserve in one step**, with optional breakfast and a live price breakdown. Nothing is paid online.
- **Sign in with Google** and come straight back to the cabin, with the picked dates still there.
- **Manage stays** in a guest area: upcoming and past stays, the same status the front desk sees, paid or due, and the booking number to show on arrival.
- **Change or cancel** a stay until the arrival day, and fill in nationality and ID before arriving, so check-in is quicker.

## How it works with the dashboard

- Cabins archived in the dashboard disappear from the website.
- Breakfast price, stay lengths and the guest limit come from the dashboard's Settings, so a change there changes the website at once.
- When the front desk checks a guest in or marks a booking as paid, the guest sees it in their reservations, and the stay can no longer be changed.

## Built with

Next.js 14 (App Router, Server Components, Server Actions) · React · Tailwind CSS · Supabase (Postgres, Auth, Storage) · date-fns · react-day-picker · Vitest

## Under the hood

- Guests and staff share one Supabase Auth, but being signed in gives no staff rights: staff are the accounts on the dashboard's team list. A guest reads their own profile and bookings as themselves, so the database's access rules decide what they see.
- The browser only sends a cabin and two dates. Nights, prices, guest limits and free dates are all checked again on the server before a booking is saved, so a price can't be changed from the browser and two guests can't book the same night.
- One pricing module is shared by the price the guest sees and the price the server saves.
- Guests sign up with their name, email and password, or continue with Google. The first sign in creates their guest profile, or takes over the one the hotel already had for their email after a phone booking.
- Saving a booking still uses the secret key on the server, after checking who is signed in. It moves into database functions in the next step, and the key goes with it.
- Cabin pages are generated at build time and refreshed every hour.

## Running it locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill it in from your Supabase project. The database itself (tables, access rules) is set up from the [Ardevane Operations](https://github.com/ahmedmoh14314-code/ardevane-operations) repository, in `supabase/`.

In the Supabase dashboard:

- **Authentication > URL Configuration > Redirect URLs:** add `http://localhost:3000/**` (and your live address).
- **Authentication > Sign In / Providers > Google:** turn it on with your Google OAuth client. In Google Cloud, that client's redirect URI is the callback URL Supabase shows there.

Tests: `npm test`.
