Generate a cityscape thumbnail for a blog post.

Arguments: $ARGUMENTS

Instructions:
1. Parse the arguments to extract the blog post path and location. Expected format: `<blog-post-path> <location>`
   - If only one argument, use it as the blog post path and default location to "chicago"
   - Location can be multiple words like "puerto vallarta"

2. Run the thumbnail generator:
   ```bash
   node scripts/generate-thumbnail.js <blog-post-path> <location>
   ```

3. After generation, read and display the generated thumbnail image to the user so they can see the result.

4. Let the user know:
   - The image was saved to `static/img/blog/{slug}-thumbnail.png`
   - The blog post's frontmatter was updated with the image path

Built-in locations with custom prompts: chicago, manila, la, orlando, champaign
Any other city name works too (e.g., tokyo, "puerto vallarta", london)
