# kalendra

`KalendraCalendar` is Kalendra's booking calendar for React: it books an event, or reschedules a booking by id.
The Kalendra web app and the Numuw admin both use it, so the calendar lives in one place.

## Install

```bash
npm install kalendra
```

Peer dependencies: `react`, `react-dom` (17 or 18) and `styled-components` 6. Everything else is bundled.
The bundle starts with `"use client"`, so it works in Next's App Router.

## Book an event

```tsx
import { KalendraCalendar } from "kalendra";

<KalendraCalendar
  calenderUrl="https://backend.calendar.example.com"
  eventTypeId="EVENT_TYPE_ID"
  kalendra_user_id="HOST_ID" // leave out to let a round-robin event pick the host
  responses={{ name: "Sara", email: "sara@example.com" }}
  onSuccess={(booking) => console.log("booked", booking?.id)}
  onError={(error) => console.error(error)}
/>;
```

## Timezone

The calendar starts in the browser's timezone (or the `timezone` prop). Its picker lists the tzdata zones A–Z by country, shows each zone's GMT offset on the day being booked (so daylight saving is included, e.g. Beirut GMT+2 in November, GMT+3 in April), and searches by country, city or offset. The zone-to-country table (`src/timezoneCountries.ts`) is generated from tzdata `zone.tab`.

## Reschedule a booking

```tsx
<KalendraCalendar calenderUrl={url} bookingToBeRescheduledId="BOOKING_ID" onSuccess={...} />
```

The booking's event, host and answers are reused, and the heading shows the booking's title. By default the calendar sends the move to Kalendra itself
(`PATCH /reschedule-booking`, with `rescheduledBy` when given).

## Let your backend do the write

Pass `onSubmitBooking` and the calendar hands you the booking body (`BookingDraft`: start and end time, timezone,
formatted times, answers, and `bookingId` when rescheduling) instead of calling Kalendra. Resolve when your backend
has saved it; reject to show the error. `onSuccess` gets what you resolve with.

```tsx
<KalendraCalendar
  calenderUrl={url}
  bookingToBeRescheduledId={bookingId}
  onSubmitBooking={async (draft) => {
    await api.reschedule(sessionId, draft);
  }}
/>
```

## Props

| Prop | What it does |
| --- | --- |
| `calenderUrl` (required) | Kalendra's PocketBase URL |
| `apiUrl` | Root of Kalendra's custom routes (`/availability/...`), when it isn't `calenderUrl` (a local proxy) |
| `eventTypeId` | The event to book; not needed when rescheduling |
| `kalendra_user_id` | The host to book; without it a round-robin event picks one |
| `bookingToBeRescheduledId` | Reschedule this booking |
| `onSubmitBooking` | Take over the write (see above) |
| `onSuccess`, `onError` | Called after the booking or move |
| `responses` | Prefilled answers to the booking questions |
| `duration` | The first duration to show |
| `timezone` | The timezone to show times in at first; the browser's otherwise |
| `rescheduledBy` | Kalendra user id recorded on a direct reschedule |
| `themeMode` | `"light"` (default) or `"dark"` |
| `content` | Text overrides (`book`, `noAvailableSlots`, `tryNextMonth`, ...) |
| `direction`, `teamName`, `styles` | Layout direction, round-robin team name, wrapper style |
| `LoadingIndicator`, `NoEventError` | Shown while loading, and when the event or booking can't be loaded |

`MeetingScheduled` (a booking summary) is exported too.

## Build

```bash
yarn install
yarn build   # tsc, then rollup to lib/src
```

The source of truth is this repo. It was rebuilt in 0.2.0 from the Kalendra web app's calendar (server-side
availability, `/event/book/managed`), which now uses this package.
