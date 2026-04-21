---
inclusion: manual
---

# Entity Field Naming

All backend fields are camelCase:
- `screenName` (not `screen_name`)
- `likeCount` (not `like_count`)
- `viewCount`, `retweetCount`, `publishedAt`, `userFollowers`, `emotion`

Never use:
- `post.Emotion?.label` (wrong casing)
- `post['user.followers']` (dot notation in bracket)
- snake_case field access
