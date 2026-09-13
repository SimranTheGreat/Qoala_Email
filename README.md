# AI Triage Inbox

A frontend-only React app for triaging inbound messages with AI-assisted summaries, categorization, and draft replies. The AI is assistive — the user stays in control of status, priority, notes, and generated text.

## Setup

```bash
npm install
npm run dev       # start dev server (Vite)
npm run build     # type-check + production build
npm run preview   # preview the production build locally
npm run lint      # eslint
```

No environment variables are required. The app runs entirely in Mock AI mode — there is no backend and no API key required.

## Feature Summary

### Inbox List

- Sender, subject, channel, status, priority, and received time shown per row.
- Filters for status, priority, and sender.
- Client-side search across subject, sender, body, channel, and tags.
- Bulk selection with checkbox/select-all.
- Bulk Mark Done and delete actions.
- Keyboard triage:
  - `J` / `K` — move between rows
  - `X` — select the active row
  - `D` — mark the active inbox item Done
- Star/unstar emails.
- Separate Inbox, Starred, Sent, and Drafts views.
- Folder state is managed through separate Zustand stores.

### Item Detail View

- Full message body.
- Editable status and priority.
- Notes field.
- AI Assist panel with loading, error, retry, and success states.

### AI Assist Panel

- Mock AI mode with deterministic per-item output: the same item produces the same result.
- Simulated AI latency between 200–1200ms.
- Deterministic failure rate of approximately 12.5% to exercise validation and error states.
- AI output is validated with Zod against the required contract:
  - `summary_bullets`
  - `category`
  - `priority`
  - `suggested_action`
  - `draft_reply`
  - `confidence`
- Debug mode shows raw AI JSON, validation errors, and retry.
- Draft replies are progressively rendered character-by-character.
- `Stop` cancels generation while preserving the partial draft.
- `Retry` explicitly starts a new generation.
- Generated text is not silently regenerated over the user's edited draft.
- AI responses are cached per item using the item ID.
- In-flight AI requests are cancelled with `AbortController` when switching items or retrying.

## State Architecture

Application concerns are split across separate Zustand stores rather than one global store:

- `InboxStore` — inbox emails and updates
- `SentStore` — sent emails
- `DraftStore` — draft emails
- `StarredStore` — starred emails
- `AiStore` — per-item AI response cache

Email and AI response shapes are defined with Zod schemas in `types/email.ts` and `types/aiResponse.ts`. The schemas provide both runtime validation and inferred TypeScript types.

## AI Mock Design

The mock service uses the email ID to select the corresponding deterministic AI response.

Normal responses are validated before being returned to the UI. A deterministic subset of requests returns deliberately invalid responses so the application can demonstrate schema-validation failures. The invalid output varies between cases such as invalid category, invalid priority, invalid confidence, and invalid summary length.

The mock service also supports `AbortSignal`, allowing requests to be cancelled when the user switches emails or starts another generation.

## Performance

Lighthouse should be run against the production build rather than the Vite development server:

```bash
npm run build
npm run preview
```

The production build uses Vite's bundling and minification.

The application was checked with Lighthouse desktop. Performance and Best Practices are the primary metrics targeted by the assignment.

## Tradeoffs / Known Gaps

- The AI mock dataset contains 20 prepared AI responses for the seeded inbox data. Items without a corresponding mock response show the AI error state.
- Keyboard shortcuts currently cover navigation, selection, and Mark Done (`J` / `K` / `X` / `D`); Enter-to-open and Escape-to-close are not implemented.
- There is no dedicated empty-state component for a search/filter combination that returns zero rows.
- There is no real AI provider integration; Mock AI mode is the only provider.
- Streaming is simulated client-side after the mock response is received rather than using a real streaming AI API.

## Project Structure

```text
src/
├── aiData.json
├── data.json
├── components/
│   ├── AIAssist.tsx
│   ├── AIDebugPanel.tsx
│   ├── AIDraftReply.tsx
│   ├── AISummary.tsx
│   ├── ComposeScreen.tsx
│   ├── EmailControls.tsx
│   ├── EmailDetail.tsx
│   ├── EmailDetailHeader.tsx
│   ├── EmailList.tsx
│   ├── EmailNotes.tsx
│   ├── EmailRow.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Toolbar.tsx
├── pages/
│   ├── Home.tsx
│   └── index.ts
├── services/
│   ├── index.ts
│   └── mockAI.ts
├── store/
│   ├── AiStore.ts
│   ├── DraftStore.ts
│   ├── InboxStore.ts
│   ├── SentStore.ts
│   ├── StarredStore.ts
│   └── store.ts
└── types/
    ├── aiResponse.ts
    ├── email.ts
    └── index.ts
```

See `TIMELOG.md` for the development time breakdown and final review notes.
