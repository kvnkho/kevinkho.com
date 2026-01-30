# Thumbnail Generator Skill

Generate a cityscape thumbnail for a blog post in a rough hand-drawn ink sketch style.

## Usage

```
/thumbnail <blog-post-path> <location>
```

## Arguments

- `blog-post-path` - Path to the blog post markdown file (e.g., `blog/2026-01-15-new-stack.md`)
- `location` - City name for the scene (e.g., `chicago`, `manila`, `tokyo`)

## Built-in Locations

These locations have custom descriptions for more accurate results:
- `chicago` - L train, brick buildings, urban density
- `manila` - Jeepneys, tangled power lines, dense chaos
- `la` - Palm trees, wide streets, golden light
- `orlando` - Humid Florida, strip malls, big sky
- `champaign` - College town, flat midwest, cornfields

Any other city name will work with a generic street scene prompt.

## What It Does

1. Reads the blog post's title, description, and tags
2. Generates a DALL-E 3 image with:
   - Rough, hand-drawn ink sketch style
   - Empty city street scene (no people)
   - Muted blue/teal accent color
   - 16:9 landscape ratio
3. Saves the image to `static/img/blog/{slug}-thumbnail.png`
4. Updates the blog post's `image:` frontmatter

## Examples

```
/thumbnail blog/2026-01-15-new-stack.md chicago
/thumbnail blog/2025-12-15-ai-compliance-tests.md manila
/thumbnail blog/my-post.md "puerto vallarta"
```

## How to Execute

Run this command:

```bash
node scripts/generate-thumbnail.js <blog-post-path> <location>
```

For example:
```bash
node scripts/generate-thumbnail.js blog/2026-01-15-new-stack.md chicago
```

## Requirements

- `OPENAI_API_KEY` must be set in `.env`
- The blog post must exist and have frontmatter with at least a `title`
