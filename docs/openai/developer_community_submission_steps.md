# Developer Community Submission Steps

Date: 2026-06-16

Purpose: exact manual flow for sending the sanitized review packet to the OpenAI Developer Community without implying approval, endorsement, or partnership.

## Target

OpenAI Developer Community:

```text
https://community.openai.com/
```

The OpenAI Developers site links to community resources, Codex docs, Codex Security docs, deployment checklist content, and cybersecurity checks. Use the community path for developer feedback. Use OpenAI brand/communications contact only for brand, marks, public announcement, or press-style wording questions.

## Current Submission Status

Status recorded on 2026-06-16:

```text
OpenAI Developer Community submission created.
Account temporarily on hold by automated moderation pending staff review.
No OpenAI approval, endorsement, or release authorization has been received.
```

Hold notice URL:

```text
https://community.openai.com/t/account-temporarily-on-hold/1383902
```

Operational decision:

```text
Wait for staff/community review before creating a GitHub repository or public deployment.
```

## What To Upload Or Reference

Use the sanitized review packet:

```text
local-evidence/fccsecurity-openai-review-packet-20260616.zip
```

SHA-256 receipt:

```text
local-evidence/fccsecurity-openai-review-packet-20260616.zip.sha256
```

Do not upload:

- unsanitized local project ZIP;
- raw scan work directory;
- browser profile data;
- screenshots with private data;
- credentials, `.env`, tokens, cookies, or local caches.

## Manual Steps

1. Open `https://community.openai.com/`.
2. Sign in with the account you want associated with the question.
3. Create a new topic.
4. Choose the closest category related to Codex, safety, deployment, or developer support.
5. Use the title from `docs/openai/openai_developer_forum_post.md`.
6. Paste the post body from `docs/openai/openai_developer_forum_post.md`.
7. Attach the sanitized ZIP only if the forum allows attachments and you are comfortable sharing it there.
8. If attachments are not allowed, paste the high-level summary only and offer to share the packet privately with OpenAI staff/moderators.
9. Do not state or imply that OpenAI has approved the project.
10. Do not publish the GitHub repo or static preview in the same step.

## If Asked For A Link

Use a private GitHub repository link only after the repo seed has been created and reviewed.

Do not use Netlify, GitHub Pages, or public GitHub as the first link.

## Response Handling

If the community response says the wording is fine:

- create or use a private GitHub repo;
- keep the non-affiliation disclaimer;
- keep public wording factual;
- do not use OpenAI marks beyond factual references.

If the community response flags wording:

- patch the repo docs first;
- regenerate the review packet;
- regenerate the GitHub seed;
- do not deploy until the release gate is clean.
