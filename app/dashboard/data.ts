/*
 * Side quests that run alongside the main hackathon.
 * Race quests go to whoever finishes first; award quests are judged at the deadline.
 * Flash quests stay hidden until they drop, then run for a short window (set opensTime/closesTime).
 * A bounty makes an unclaimed quest worth more over time.
 *
 * To record a winner, fill in `winner`. Leave it null while the quest is open.
 * Dates are inclusive, in YYYY-MM-DD; times are local HH:MM.
 */

export type Winner = {
  name: string; // team or person
  kind: "team" | "solo";
  wonOn: string; // YYYY-MM-DD
  wonAt?: string; // HH:MM, local time (optional)
  proof?: string; // link to the published theme, checkout, etc.
};

export type Quest = {
  id: string;
  title: string;
  rule: string; // what counts as a win, in one sentence
  type: "race" | "award";
  category: "Payments" | "Themes" | "Social" | "Quality" | "Community" | "Flash";
  points: number; // starting points
  opens: string;
  closes: string;
  opensTime?: string; // default 00:00
  closesTime?: string; // default: end of the day; "24:00" means midnight
  flash?: boolean; // hidden as "???" until it opens
  hint?: string; // teaser shown while a flash quest is hidden
  bounty?: { step: number; everyHours: number }; // +step points every N hours while unclaimed
  winner: Winner | null;
};

export const HACK_START = "2026-10-31";
export const HACK_END = "2026-11-03";
export const SUBMIT_DEADLINE = "2026-11-04"; // closes at 23:59 local time

export const QUESTS: Quest[] = [
  {
    id: "first-real-sale",
    title: "First real sale",
    rule: "A real customer (not a teammate or friend) pays real money through your store. Share the order and a message from the buyer as proof.",
    type: "race",
    category: "Payments",
    points: 400,
    opens: HACK_START,
    closes: HACK_END,
    winner: null,
  },
  {
    id: "mobile-money",
    title: "First mobile money checkout",
    rule: "Complete a test order paid with MTN MoMo, Telecel Cash or M-Pesa through your own checkout.",
    type: "race",
    category: "Payments",
    points: 300,
    opens: HACK_START,
    closes: HACK_END,
    winner: null,
  },
  {
    id: "flash-rescue",
    title: "Rescue mission",
    rule: "We've planted a broken checkout in the sample store. Find the bug, fix it and complete an order within the 2-hour window.",
    type: "race",
    category: "Flash",
    points: 250,
    opens: "2026-11-01",
    opensTime: "09:00",
    closes: "2026-11-01",
    closesTime: "11:00",
    flash: true,
    hint: "Drops without warning on day 2. Something is broken.",
    winner: null,
  },
  {
    id: "flash-night-owl",
    title: "Night owl",
    rule: "Ship a working discount code on your store and complete an order that uses it, between 22:00 and midnight.",
    type: "race",
    category: "Flash",
    points: 200,
    opens: "2026-11-02",
    opensTime: "22:00",
    closes: "2026-11-02",
    closesTime: "24:00",
    flash: true,
    hint: "Drops late on day 3. Bring snacks.",
    winner: null,
  },
  {
    id: "first-payment",
    title: "First to publish a payment method",
    rule: "Publish a live payment flow on Krifth and complete one successful test order end to end.",
    type: "race",
    category: "Payments",
    points: 300,
    opens: HACK_START,
    closes: HACK_END,
    winner: null,
  },
  {
    id: "first-theme",
    title: "First to publish a theme",
    rule: "Publish a storefront theme with a home page, a product page and a working cart.",
    type: "race",
    category: "Themes",
    points: 300,
    opens: HACK_START,
    closes: HACK_END,
    winner: null,
  },
  {
    id: "first-merchant",
    title: "First real merchant live",
    rule: "Launch a store for a real shop or Instagram seller with at least five of their actual products.",
    type: "race",
    category: "Themes",
    points: 250,
    opens: HACK_START,
    closes: HACK_END,
    winner: null,
  },
  {
    id: "insta-to-checkout",
    title: "First Instagram-to-checkout order",
    rule: "Post the product on Instagram (your own test account is fine), then place a test order that starts from the story link sticker or bio link and ends at a paid checkout. Share a screen recording of the full journey as proof.",
    type: "race",
    category: "Social",
    points: 250,
    opens: HACK_START,
    closes: HACK_END,
    winner: null,
  },
  {
    id: "ten-orders",
    title: "First to 10 test orders",
    rule: "Process ten separate test orders through your own checkout, each with a different product or variant.",
    type: "race",
    category: "Payments",
    points: 200,
    opens: HACK_START,
    closes: HACK_END,
    winner: null,
  },
  {
    id: "multi-brand",
    title: "First multi-brand setup",
    rule: "Run two storefronts with different themes under one merchant account, sharing one product catalog.",
    type: "race",
    category: "Themes",
    points: 200,
    opens: HACK_START,
    closes: HACK_END,
    bounty: { step: 50, everyHours: 12 },
    winner: null,
  },
  {
    id: "mobile-95",
    title: "First 95+ mobile score",
    rule: "Reach a Lighthouse mobile performance score of 95 or higher on your storefront's home page.",
    type: "race",
    category: "Quality",
    points: 150,
    opens: HACK_START,
    closes: HACK_END,
    bounty: { step: 50, everyHours: 12 },
    winner: null,
  },
  {
    id: "under-a-second",
    title: "Under a second",
    rule: "Your storefront home page becomes usable in under 1 second on a throttled slow 3G test. Share the Lighthouse or DevTools trace as proof.",
    type: "race",
    category: "Quality",
    points: 150,
    opens: HACK_START,
    closes: HACK_END,
    winner: null,
  },
  {
    id: "two-currencies",
    title: "Two currencies",
    rule: "Show correct prices in both GHS and USD, with a working switch and totals that stay right all the way through checkout.",
    type: "race",
    category: "Payments",
    points: 150,
    opens: HACK_START,
    closes: HACK_END,
    winner: null,
  },
  {
    id: "accessible-checkout",
    title: "Most accessible checkout",
    rule: "Judged on keyboard use, screen-reader labels and colour contrast across the full checkout.",
    type: "award",
    category: "Quality",
    points: 200,
    opens: HACK_START,
    closes: "2026-11-04",
    winner: null,
  },
  {
    id: "best-reel",
    title: "Best 15-second Reel",
    rule: "Post a Reel of 15 seconds or less that makes people want to shop your store. Judged on how clear, fun and on-brand it is.",
    type: "award",
    category: "Social",
    points: 200,
    opens: HACK_START,
    closes: "2026-11-04",
    winner: null,
  },
  {
    id: "community-pick",
    title: "Community pick",
    rule: "The project with the most participant votes when voting closes.",
    type: "award",
    category: "Community",
    points: 250,
    opens: "2026-11-04",
    closes: "2026-11-05",
    winner: null,
  },
];

/* Sample winners used only in preview mode (?preview=1) so the design can be reviewed before the event. */
export const PREVIEW_WINNERS: Record<string, Winner> = {
  "first-payment": { name: "Checkout Club", kind: "team", wonOn: "2026-11-01", wonAt: "09:18" },
  "first-theme": { name: "Ama Owusu", kind: "solo", wonOn: "2026-10-31", wonAt: "21:47" },
  "insta-to-checkout": { name: "Kente Labs", kind: "team", wonOn: "2026-11-01", wonAt: "07:05" },
};
