# Beacon — Design Spec
**Date:** 2026-05-06
**Project:** CreatorOps
**Location:** `beacon/` subdirectory
**Status:** Approved for implementation planning

---

## Overview

Beacon is CreatorOps' custom Discord bot — the primary interface between the Discord community and the CreatorOps platform. It is not a generic bot with bolted-on AI. It is a self-aware, proactive support system built on the principle that the best support arrives before the client needs to ask.

Beacon's identity rests on three pillars:
- **Persistent memory** — nothing starts from zero
- **Proactive awareness** — Beacon notices patterns and acts without being asked
- **Persona & identity** — Beacon represents the CreatorOps brand in every interaction

Tech stack: **discord.js** (bot process), **Convex** (backend brain), **Clerk** (auth/verification), **Claude API** (AI reasoning layer).

---

## Architecture

Beacon follows a strict four-layer architecture where Discord is only ever I/O. All state, reasoning, and scheduling lives in Convex.

```
Discord Event
     ↓
discord.js bot (I/O only — no business logic)
     ↓ mutation
Convex (brain — all state, scheduling, decisions)
     ↓ action (when reasoning needed)
Claude API (via Convex actions — never called directly from bot)
     ↓ response stored in Convex
discord.js reads Convex subscription
     ↓
Discord Response
```

**Data flows in one direction.** Nothing bypasses Convex. The bot never calls Claude directly. Claude never writes to Discord directly.

### Subdirectory Structure

```
beacon/
├── bot/                        # discord.js bot process
│   ├── src/
│   │   ├── index.ts            # entry point, Discord client setup
│   │   ├── handlers/           # event handlers (messageCreate, guildMemberAdd, etc.)
│   │   ├── commands/           # slash command definitions
│   │   ├── voice/              # @discordjs/voice recording + channel management
│   │   └── convex-client.ts    # Convex connection + subscription setup
│   ├── package.json
│   └── Dockerfile
├── convex/                     # Convex backend (shared with CreatorOps web app)
│   ├── schema.ts               # full data model
│   ├── members.ts              # member mutations/queries
│   ├── tickets.ts              # ticket lifecycle
│   ├── servers.ts              # Pterodactyl server state
│   ├── incidents.ts            # incident management
│   ├── memory.ts               # Beacon memory layer
│   ├── insights.ts             # proactive analysis results
│   ├── knowledge.ts            # FAQ/knowledge base
│   ├── oncall.ts               # on-call rotation (toggleable)
│   ├── meetings.ts             # meeting scheduling + post-meeting pipeline
│   ├── ai.ts                   # Claude actions
│   └── _scheduled/             # cron jobs (monitoring, analysis, reports, meeting triggers)
└── docs/
    └── specs/
        └── 2026-05-06-beacon-design.md
```

---

## Tech Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Bot process | discord.js (Node.js) | Discord I/O only |
| Backend | Convex | All state, scheduling, real-time sync |
| Auth | Clerk | Account linking, Discord ↔ CreatorOps identity |
| AI | Claude API (via Convex actions) | Reasoning, triage, insights, persona |
| Voice | @discordjs/voice | Voice channel join, per-user audio recording |
| Transcription | Whisper or Deepgram | Audio → transcript |
| Hosting | Railway or Fly.io | Long-running bot process |
| Monitoring | UptimeRobot or BetterUptime | External uptime validation |

Convex is the single source of truth for **both** the Discord bot and the CreatorOps web app. No sync layer, no duplication — a ticket opened in Discord is immediately visible in the client dashboard.

---

## Token Efficiency Strategy

Beacon uses a three-tier resolution system. Claude is only called when cheaper paths are exhausted.

| Tier | Handler | Token Cost | When Used |
|------|---------|-----------|-----------|
| 1 | Deterministic (Convex queries, slash commands) | Zero | Status lookups, role assignments, FAQ cache hits, self-service commands |
| 2 | Cached AI (Convex knowledge base) | Near-zero | Questions answered before; Beacon serves stored response |
| 3 | Live Claude | Tokens spent | Novel support questions, incident reasoning, proactive insight generation |

**Model routing within Tier 3:**
- **Haiku** → ticket categorization, short Q&A, welcome messages, routine responses
- **Sonnet** → complex triage, incident analysis, escalation reasoning, self-reports, RCA drafting

**Memory injection is compressed.** Scheduled Convex jobs summarize interaction history into compact context objects. Claude receives summaries, never raw transcripts.

**Background jobs batch.** Proactive analysis runs on a schedule across all data — one Claude call produces insights for the whole server, not one call per event.

**Exception:** Token efficiency does not apply to urgent real-time events (server offline, ticket opened). These bypass tiers entirely and receive immediate Tier 3 treatment.

---

## Immediate Support Architecture

CreatorOps' core value proposition is immediate support. Two event types receive unconditional priority treatment:

### Server / World Down
- Convex scheduled function polls Pterodactyl every **30–60 seconds**
- On status flip (online → offline): Convex action fires immediately
  - Client receives DM with server name and timestamp
  - Staff ops channel receives priority ping with node context
  - If multiple clients on same node go offline simultaneously → **node-wide incident** (see Incident Management module)
- External uptime monitor (UptimeRobot/BetterUptime) cross-references Pterodactyl status
  - Discrepancy between sources → Beacon flags as uncertain, alerts staff
- Maintenance windows registered in Convex suppress false-positive alerts during planned downtime

### Ticket Opened
- Convex mutation fires the moment `/support` is invoked
- Convex action immediately calls Claude (Haiku first) for triage
- Client receives Beacon's response within seconds — never queued
- If unresolved after one exchange: private thread opened, client included, on-call staff pinged with full context summary
- SLA clock starts at ticket creation timestamp

---

## Feature Modules

### 1. Verification & Identity

Members link their Discord account to their CreatorOps account via `/verify`. This triggers a Clerk OAuth flow. On completion:
- Convex updates the `members` table with linked Clerk ID
- Discord role assigned automatically based on subscription tier (free / standard / premium / founding)
- Roles re-sync automatically when tier changes in Convex — no manual admin action required
- Unverified members are gated to read-only public channels

Clerk handles identity for both the Discord bot and the CreatorOps web app, giving Beacon full access to account tier, billing status, and server assignments.

---

### 2. Support & Tickets

**Opening:** Members use `/support` or a button in the #support channel.

**AI triage (immediate):** Beacon attempts resolution using:
1. Knowledge base lookup (Tier 1 — zero tokens)
2. Cached AI response (Tier 2 — near-zero tokens)
3. Live Claude triage (Tier 3 — full reasoning)

**Escalation:** If unresolved, Beacon opens a private thread with both the client and staff. Client is never left in a waiting room — they are in the conversation. Staff receives a Beacon-generated context summary before they type a word.

**Ticket lifecycle:** `open → in_progress → resolved → closed`
- Full conversation log stored in Convex
- CSAT rating (1–5 via reaction) sent automatically on resolution
- Stale tickets (48h no activity) receive an automated follow-up; closed after 24h additional silence with reopen invitation

**SLA enforcement:** SLA window defined in Convex config. If a ticket has no staff response within the SLA window, Beacon escalates automatically and pings on-call again.

**Staff notes:** Staff can attach private notes to any client record (`/note @client <text>`). Beacon's AI reads these notes in future interactions with that client.

**Duplicate detection:** If multiple open tickets share the same apparent root cause (same node, similar error patterns), Beacon links them and surfaces a consolidation suggestion to staff.

**Sentiment detection:** Beacon reads tone on every ticket message. Frustrated clients are flagged as high priority and escalate sooner than the standard SLA window.

---

### 3. Server Status & Alerts

**Live status:** Members run `/status` to see their Minecraft server's current state pulled from Pterodactyl.

**#server-status channel:** Beacon maintains a live auto-updating status embed. No need to ask — clients see their server state at a glance.

**Proactive outage DM:** When a server goes offline (detected via 30–60s poll), the affected client is DM'd immediately with server name, time of detection, and a note that the team has been alerted.

**Post-recovery message:** When the server comes back online, Beacon DMs the client again confirming recovery and total downtime duration.

**Post-incident summary:** After any outage, Beacon sends the client a structured summary: what went down, timestamp range, duration, actions taken. Clients receive this automatically — no need to ask.

**Proactive resource warnings:** If a server's CPU or RAM trends toward a resource ceiling (tracked over the monitoring loop), Beacon proactively messages the client and flags for staff before a crash occurs.

**Maintenance windows:** Staff schedule maintenance in Convex via `/maintenance schedule`. Beacon sends affected clients:
- 24-hour advance notice
- 1-hour reminder
- "Maintenance starting" message
- "Maintenance complete" confirmation
Alerts are suppressed during the window.

---

### 4. Self-Service Commands

Clients can manage their own server without opening a ticket:

| Command | Action |
|---------|--------|
| `/start` | Start their Minecraft server |
| `/stop` | Stop their Minecraft server |
| `/restart` | Restart their Minecraft server |
| `/status` | Live server state from Pterodactyl |
| `/logs` | Pull recent server logs |
| `/players` | See who is currently online |
| `/whitelist add <player>` | Add player to whitelist |
| `/whitelist remove <player>` | Remove player from whitelist |
| `/backups list` | List recent backups |
| `/backups create` | Trigger a new backup |

All commands are routed through Convex actions to the Pterodactyl API. Rate limiting is enforced per client per command to prevent API abuse. Command access is gated to verified members only.

**Custom alerts:** Clients set personal thresholds via `/alerts set`. Examples: "ping me if player count drops below 5" or "alert me if CPU stays above 80% for 5 minutes." Stored in Convex, evaluated each monitoring loop.

---

### 5. Incident Management

**Node-wide incident detection:** If multiple clients on the same node go offline within the same monitoring window, Beacon treats this as a single infrastructure incident — not individual outages.

Incident flow:
1. Beacon creates a single incident record in Convex
2. Opens a dedicated incident channel (temporary, auto-archived on resolution)
3. Posts a pinned status message that updates as the incident progresses
4. DMs all affected clients directing them to the incident channel
5. Suppresses individual "your server is down" DMs for the incident duration

**Root cause analysis (RCA) drafting:** After a major incident resolves, Beacon pulls the full timeline from Convex and drafts an RCA document for staff review. Staff edits and approves; Beacon posts it to affected clients.

---

### 6. Moderation (Lightweight)

Beacon's moderation is minimal — focused on community health, not enforcement.

- **Automod rules** stored in Convex (configurable without redeployment)
- **Welcome flow** for new members: greeting message, verification instructions, key resource links
- **Onboarding checklist** for new clients: verify → read getting started guide → check server status
- **Suspicious activity detection:** multiple failed verification attempts, command rate abuse — flagged silently to staff
- No heavy infraction system; no ban/mute management

---

### 7. Self-Awareness System

#### Memory
Every meaningful event writes to the `memory` table in Convex:
- Ticket opened/resolved
- Server outage/recovery
- User verified
- Escalation triggered
- Sentiment flag
- CSAT rating received

Memory is scoped at three levels:
- **Per-client** — full history for each CreatorOps client
- **Per-server** — history for each Minecraft server
- **Server-wide** — community-level patterns and trends

When Claude is called, Beacon injects the relevant memory scope as compressed context. Scheduled Convex jobs compress raw event logs into summaries on a rolling basis.

#### Proactive Awareness
Convex scheduled functions run continuously without human triggers:

| Trigger | Action |
|---------|--------|
| Ticket volume spike | Staff channel alert with category breakdown |
| Server offline | Immediate client DM + staff ping |
| Resource ceiling approach | Proactive client message + staff flag |
| Same question asked 3+ times | Flag for knowledge base addition |
| Client frustration detected | Priority escalation |
| New member unverified 48h | Gentle verification nudge |
| Client inactive 30 days, server running | Retention flag for staff |
| CSAT trending down | Staff alert with context |
| Cancellation signal detected | Retention flow triggered |

#### Persona & Identity
Every Claude call inherits a base system prompt defining Beacon's identity:
- Name: Beacon
- Role: CreatorOps' support and community bot
- Knows: full product context, pricing tiers, server infrastructure, the CreatorOps team
- Tone: professional, direct, approachable — knows Minecraft and the creator space
- Self-aware: can describe its own state, performance, and capabilities

`/beacon status` returns a real self-report: tickets handled, resolution rate, servers flagged, patterns detected, CSAT score.

---

### 8. On-Call Rotation *(Toggleable)*

Can be enabled or disabled via Convex config without redeployment.

**When enabled:**
- Staff register availability windows via `/oncall set <start> <end>`
- Beacon knows who is on-call at any given moment
- Escalations ping the on-call person directly, not @staff generically
- **Escalation chain:** If on-call doesn't acknowledge within 10 minutes, Beacon escalates to the next person in the defined fallback chain
- `/oncall view` shows the current on-call schedule

**When disabled:**
- Escalations ping @staff in the designated ops channel
- No individual targeting

---

### 9. Client Lifecycle Features

**Monthly reports:** At the start of each month, Beacon DMs every client their previous month's summary — uptime percentage, peak player count, incident history, resource usage trends. Generated by a scheduled Convex job; zero staff effort.

**Milestone recognition:** Beacon tracks client tenure and server milestones (3 months with CreatorOps, 1 year of uptime, 1000th player connected). Acknowledged automatically with a personalized message.

**Referral tracking:** If a client referred another client, tracked in Convex. Beacon surfaces referral milestones to staff for reward processing.

**Upgrade & downgrade conversations:** When a client expresses interest in changing their plan ("I need more RAM," "this plan is too much"), Beacon walks them through options, answers questions, and creates a qualified lead record in Convex for staff to follow up. Staff closes; Beacon qualifies.

**Cancellation & retention flow:** When Beacon detects cancellation intent (keyword detection + sentiment), it does not immediately escalate. It:
1. Acknowledges the client
2. Asks what's going wrong
3. Attempts AI-led resolution
4. Escalates to staff with full context only if unresolved

No client leaves without a human conversation.

---

### 10. Staff Tools

Staff-only commands for managing Beacon and the community:

| Command | Action |
|---------|--------|
| `/beacon status` | Full Beacon self-report |
| `/beacon report` | Weekly health summary |
| `/beacon clients` | All active clients with server status |
| `/beacon flag <user>` | Mark client for priority attention |
| `/beacon knowledge add` | Add entry to AI knowledge base |
| `/note @client <text>` | Add private staff note to client record |
| `/maintenance schedule` | Schedule a maintenance window |
| `/oncall set` | Register availability (when on-call enabled) |
| `/incident open` | Manually open an incident |
| `/incident resolve` | Close an incident and trigger RCA draft |

**Shift handoff:** When on-call changes, Beacon automatically briefs the incoming staff member — open tickets, active incidents, clients flagged for follow-up, recent CSAT scores.

**Deployment announcements:** When CreatorOps ships a platform update, staff triggers `/announce changelog <notes>` and Beacon posts formatted release notes to #changelog.

---

### 11. Interaction Design

**Beacon never dumps text into chat. Beacon posts embeds. Users click buttons. Embeds update.**

Every surface Beacon creates is a living UI component. State changes edit the embed in-place. Buttons are context-aware — what a client sees differs from what staff sees, and available actions change based on current state.

**The only time a user types is in a Discord Modal** — a form that pops up when opening a ticket (title + description). Everything else is a button click.

#### Embed Patterns

**Persistent support embed** — lives in #support permanently. One button: [Open a Ticket]. Always visible, never stale.

**Ticket embed** — created in a private thread on ticket open. Color-coded by status:
- Yellow = open
- Blue = in progress
- Green = resolved
- Red = urgent/escalated

Fields: status, category, SLA countdown, assigned staff, client tier.

Client buttons: [Provide More Info] [Mark Resolved]
Staff buttons: [Mark In Progress] [Escalate] [Add Note] [Resolve]

Destructive or irreversible actions (resolve, escalate) post a confirmation embed before executing.

**Server status embed** — live card in #server-status, auto-updates each monitoring cycle. Color-coded: green (online), red (offline), yellow (starting/stopping).

Client buttons: [Restart] [View Logs] [View Players] [Open Backup]
Restart and Stop require a confirmation embed click.

**Incident embed** — pinned in the incident channel. Updates in-place as the incident progresses. Staff sees [Acknowledge] [Update Status] [Resolve]. Clients see read-only status.

**Escalation embed** — posted to on-call staff with [I'm On It]. If not clicked within 10 minutes, a new embed escalates to the next person in the chain.

**Verification embed** — persistent in #verify. One button: [Link Your Account]. Clerk OAuth handles the rest outside Discord.

**Meeting embed** — posted when a meeting is about to start. Shows: client name, meeting type, scheduled time. Buttons: [Join Voice Channel] (client), [End Meeting] [View Summary] (staff).

---

### 12. Meeting Scheduling & Voice Recording

Clients booking studio tier, event tier, or collab consultations can schedule a meeting directly from the CreatorOps website. Beacon owns the full lifecycle — from booking confirmation to post-meeting summary stored in the client's record.

#### Scheduling Flow (Website → Convex)

A scheduling UI on the CreatorOps site (date/time picker for available slots) writes a `meetings` record directly to Convex on submission. No third-party middleware. Available slots are defined by staff in Convex config.

On booking:
- Client receives a confirmation DM from Beacon with meeting type, date/time, and a note that the session will be recorded
- Staff receives a parallel notification embed with client context

Reminder DMs sent automatically:
- 24 hours before
- 1 hour before
- 15 minutes before

#### At Meeting Time (Convex → Discord)

A Convex scheduled function fires at the booked time:
1. Beacon creates a temporary voice channel under a designated "Consultations" category
2. Posts a meeting embed in a staff channel with [Join Voice Channel] button
3. DMs the client a direct link to the voice channel
4. Bot joins the voice channel via `@discordjs/voice`
5. Beacon announces in the channel: **"This meeting is being recorded."** (Discord ToS compliance — explicit consent required)

#### Recording & Transcription

Beacon captures per-user audio tracks using `@discordjs/voice`'s receiver. Per-user recording means the transcript preserves who said what.

When the channel empties or staff clicks [End Meeting] on the embed:
1. Recording stops
2. Audio uploaded to storage (Convex file storage)
3. Convex action sends audio to transcription service (Whisper or Deepgram)
4. Transcript returned → passed to Claude with Beacon's system prompt
5. Claude generates a structured meeting summary: key decisions, action items, follow-ups, client needs
6. Summary stored in the client's Convex `meetings` record and linked to their `members` record

#### Post-Meeting Delivery

- Staff receives a private embed with the full summary and [View Transcript] [View Recording] buttons
- Client receives a DM with the meeting summary
- Summary is injected into Beacon's memory for that client — future interactions reference it
- Voice channel auto-archived after meeting ends

#### Scheduling page states the following clearly:
- Sessions are recorded for quality and summary purposes
- Recordings are stored securely and used only for internal notes
- Clients receive a copy of their meeting summary

---

### 13. Application Onboarding Scheduling Flow

When an application is approved in the CreatorOps admin dashboard, Beacon owns the next step — getting the right communication to the right person based on how they said they want to be contacted.

#### The Availability Problem

James's schedule is variable (WFH vs. office) and can't be defined as recurring calendar blocks. The model is **on-demand availability**: James adds open slots when they appear, and Beacon reacts immediately to match waiting applicants to those slots.

#### Approval Trigger

When staff clicks Approve in the admin dashboard, the `onboarding.approveApplication` action runs. In addition to sending the confirmation email, it writes a `pendingOnboardings` record to Convex:

```
pendingOnboardings: {
  applicationId: Id<"foundingApplications" | "standardApplications" | "studioInquiries" | "eventsQuotes">,
  formType: "founding" | "standard" | "studio" | "events",
  discordUsername: string,          // from application form
  onboardingPreference: string,     // from application form
  status: "waiting_slots" | "scheduled" | "chat_only" | "complete",
  createdAt: number,
}
```

#### Preference Branching

Beacon reads `onboardingPreference` from the application and routes accordingly:

| Preference | Beacon action |
|---|---|
| **Video call** (this week / next week / within two weeks / flexible) | DMs applicant: "You're approved! I'll send available times as they open up." Sets status `waiting_slots`. |
| **Chat only** (Discord or email) | DMs applicant with welcome info, Discord invite, and next steps. No scheduling loop. Sets status `chat_only`. |
| **Async / written** (async video, written surveys) | Sends async setup instructions. No scheduling loop. |

For studio and events inquiries, the `tellUsMore` / event details are included in Beacon's DM context so the first message is specific to what they described — not a generic welcome.

#### Staff Availability Commands

James defines available slots via Discord or a lightweight admin UI. Each slot is a row in `staffAvailability`:

```
staffAvailability: {
  staffDiscordId: string,
  startsAt: number,           // epoch ms
  endsAt: number,             // epoch ms
  claimed: boolean,
  claimedByPendingId?: Id<"pendingOnboardings">,
}
```

Adding a slot via Discord:
```
/available add <date> <time-range>
Example: /available add Tuesday 5:00pm–6:00pm ET
```

A Convex reactive function watches `staffAvailability`. When a new unclaimed slot is inserted, it immediately queries all `pendingOnboardings` with status `waiting_slots` and DMs each one a set of Discord buttons — one per available slot. First to click claims it.

#### Slot Selection Flow

1. Applicant receives Beacon DM with time buttons: `[Tue May 12, 5:00pm ET]` `[Thu May 14, 4:30pm ET]`
2. Applicant clicks a slot → Convex mutation marks slot `claimed`, creates a `meetings` record, updates `pendingOnboardings` to `scheduled`
3. Beacon confirms to the applicant with date/time and what to expect
4. Staff receives a notification embed with applicant name, form type, and the booked time
5. Slot becomes unavailable to all other pending onboardings

If no slots exist when an approval fires, the `waiting_slots` DM is sent immediately and the applicant is queued. They receive time options the moment any slot is added — no manual follow-up required.

#### No-Slot Fallback

If a `waiting_slots` record sits unclaimed for 48 hours with no available slots added, Beacon sends a staff alert: "X applicants are waiting for onboarding slots." This keeps the queue visible without requiring James to track it manually.

#### Meeting Lifecycle

Once a slot is booked, the full meeting pipeline from Section 12 takes over: reminders, voice channel creation at meeting time, recording, transcription, Claude-generated summary stored in the applicant's record.

---

### 14. Billing Integration

- Beacon monitors payment status via Clerk/billing webhook events in Convex
- If a payment fails, Beacon proactively DMs the client before service is affected: "We had trouble processing your payment — here's how to update your info"
- Staff receives a parallel alert
- If payment remains unresolved after 7 days, Beacon escalates with increasing urgency (day 3 reminder, day 5 warning, day 7 final notice) before any service interruption

---

## Convex Data Model

```typescript
// Core tables — full schema defined in beacon/convex/schema.ts

members: {
  discordId: string,
  clerkId: string,
  subscriptionTier: "free" | "standard" | "premium" | "founding",
  verifiedAt: number,
  notes: string,           // staff private notes
  customAlerts: Alert[],
  churnRisk: boolean,
  createdAt: number,
}

tickets: {
  memberId: Id<"members">,
  status: "open" | "in_progress" | "resolved" | "closed",
  category: string,
  priority: "normal" | "high" | "urgent",
  sentiment: "neutral" | "frustrated" | "escalated",
  openedAt: number,
  resolvedAt?: number,
  slaDeadline: number,
  staffNotes: string,
  csatScore?: 1 | 2 | 3 | 4 | 5,
  linkedTickets: Id<"tickets">[],
  conversationLog: Message[],
}

servers: {
  memberId: Id<"members">,
  pterodactylId: string,
  status: "online" | "offline" | "starting" | "stopping",
  lastSeen: number,
  cpuHistory: DataPoint[],
  ramHistory: DataPoint[],
  uptimePercent: number,
  incidentCount: number,
}

incidents: {
  affectedServers: Id<"servers">[],
  affectedMembers: Id<"members">[],
  nodeId?: string,
  status: "active" | "monitoring" | "resolved",
  timeline: IncidentEvent[],
  rcaDraft?: string,
  openedAt: number,
  resolvedAt?: number,
}

memory: {
  scope: "member" | "server" | "global",
  scopeId: string,
  eventType: string,
  summary: string,
  rawData?: any,
  timestamp: number,
}

insights: {
  type: string,
  severity: "info" | "warning" | "critical",
  summary: string,
  affectedIds: string[],
  actionTaken: boolean,
  createdAt: number,
}

knowledge: {
  question: string,
  answer: string,
  hitCount: number,
  lastUpdated: number,
  addedBy: "ai" | "staff",
}

oncall: {
  staffDiscordId: string,
  windowStart: number,
  windowEnd: number,
  fallbackOrder: string[],
  enabled: boolean,
}

maintenanceWindows: {
  scheduledBy: string,
  affectedServers: Id<"servers">[],
  startsAt: number,
  endsAt: number,
  notificationsSent: boolean,
}

meetings: {
  memberId: Id<"members">,
  type: "studio" | "event" | "collab" | "onboarding",
  scheduledAt: number,
  voiceChannelId?: string,
  status: "scheduled" | "active" | "completed" | "cancelled",
  recordingUrl?: string,
  transcriptUrl?: string,
  summary?: string,
  actionItems?: string[],
  remindersSent: boolean[],       // [24h, 1h, 15min]
  createdAt: number,
}

pendingOnboardings: {
  applicationId: string,          // Id of the source application record
  formType: "founding" | "standard" | "studio" | "events",
  discordUsername: string,
  onboardingPreference: string,   // raw value from form
  status: "waiting_slots" | "scheduled" | "chat_only" | "complete",
  meetingId?: Id<"meetings">,
  createdAt: number,
}

staffAvailability: {
  staffDiscordId: string,
  startsAt: number,
  endsAt: number,
  claimed: boolean,
  claimedByPendingId?: string,    // Id<"pendingOnboardings">
}
```

---

## Deployment

- **Bot process** (`beacon/bot/`) deploys to Railway or Fly.io as a long-running Node.js container
- **Convex backend** (`beacon/convex/`) deploys to Convex cloud — shared project with CreatorOps web app
- **Environment variables:** Discord bot token, Clerk secret key, Claude API key, Pterodactyl URL + API key
- **External monitor** (UptimeRobot/BetterUptime) configured for cross-validation of server status
- On-call rotation enabled/disabled via single boolean in Convex config — no redeployment required

---

## What Beacon Is Not

- Beacon is not a moderation-heavy bot. Enforcement is minimal by design.
- Beacon is not a public bot. It runs exclusively in the CreatorOps Discord server.
- Beacon is not a platform for clients to build bots of their own.
- Beacon is not stateless. Everything is remembered.
