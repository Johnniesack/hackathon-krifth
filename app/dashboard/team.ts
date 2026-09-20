/*
 * The signed-in participant's team.
 * TODO: load from the backend once registration and auth are connected. This is example data.
 */

export const MAX_TEAM_SIZE = 4;

export type Member = {
  id: string;
  name: string;
  role: string;
  github?: string;
  joinedOn: string; // YYYY-MM-DD
  lead?: boolean;
};

export type Team = {
  name: string;
  mode: "solo" | "team"; // how they registered; solo entrants aren't nudged to invite anyone
  track: string;
  inviteCode: string;
  members: Member[];
};

export const ME_ID = "Cephas";

export const MY_TEAM: Team = {
  name: "Checkout Club",
  mode: "team",
  track: "Payment templates",
  inviteCode: "KRF-7Q4M",
  members: [
    { id: "Cephas", name: "Cephas", role: "Full Stack", github: "cephas", joinedOn: "2026-09-21", lead: true },
    { id: "Kelly", name: "Kelly Grammy", role: "Backend", github: "kellyG", joinedOn: "2026-10-24" },
    { id: "Danielle", name: "Danielle Morgan", role: "Design", joinedOn: "2026-10-25" },
  ],
};
