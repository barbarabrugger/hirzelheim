---
name: add-image
description: Download an image from a URL and integrate it into the Hirzelheim Hugo website. Use when the user provides an image URL or wants to add/replace images on the site.
argument-hint: <image-url> [category]
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# Add Image to Hirzelheim Website

Download an image and integrate it into the Hugo site.

## Arguments

- `$0` — The image URL to download
- `$1` — (Optional) Target category. One of:
  - `hero` — Hero/banner image for the homepage
  - `garten` — Garden and outdoor images
  - `raeume` — Interior room images
  - `team` — Team and daily life images
  - `placeholder` — General placeholder images
  - If omitted, ask the user which category fits

## Steps

1. **Download** the image using `curl -L -o` to `hugo-site/static/images/<category>/`
2. **Name** the file descriptively in lowercase with hyphens (e.g., `riegelhaus-aussen.jpg`)
3. **Optimize** if needed — check file size. If over 2MB, use ImageMagick to resize to max 1920px wide:
   ```
   convert input.jpg -resize '1920x>' -quality 82 output.jpg
   ```
4. **Integrate** into the appropriate template:
   - `hero`: Update `hugo-site/content/_index.md` frontmatter with `hero_image: /images/hero/<filename>`
   - `garten`, `raeume`, `team`: Add to the relevant content page or section
   - For blog posts: Update the specific post's frontmatter with `image: /images/<category>/<filename>`
5. **Verify** the Hugo build still succeeds: `cd hugo-site && hugo --minify`
6. **Report** what was done and where the image is used

## Image Directory Structure

```
hugo-site/static/images/
├── logo.png          # Site logo
├── hero/             # Homepage hero banners
├── garten/           # Garden, terrace, outdoor views
├── raeume/           # Rooms, common areas, interior
├── team/             # Staff, residents, daily life
└── placeholder/      # Fallback images
```

## Important Notes

- Always preserve original aspect ratios when resizing
- Use descriptive German filenames where appropriate (e.g., `aussicht-regensberg.jpg`)
- For the hero image, ensure the gradient overlay in `index.html` still works well with the photo
- If the URL points to a webpage (not a direct image), try to extract the image URL first
