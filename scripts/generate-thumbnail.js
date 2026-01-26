#!/usr/bin/env node

/**
 * Thumbnail Generator for Blog Posts
 *
 * Usage:
 *   node scripts/generate-thumbnail.js <blog-post-path> <location>
 *   node scripts/generate-thumbnail.js <blog-post-path> --ref <image-path>
 *
 * Examples:
 *   node scripts/generate-thumbnail.js blog/my-post.md chicago
 *   node scripts/generate-thumbnail.js blog/my-post.md --ref ./photos/malecon.jpg
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY not found in environment');
  process.exit(1);
}

// Location-specific details for cityscapes
const LOCATIONS = {
  chicago: `Chicago street scene - elevated L train tracks overhead, classic brick buildings, urban density, maybe a glimpse of downtown towers in the distance. Winter or autumn mood.`,
  manila: `Manila street scene - dense urban chaos, jeepneys, tangled power lines everywhere, old Spanish-colonial buildings mixed with modern concrete, sari-sari stores, tropical plants peeking through. Humid, busy energy even when empty.`,
  la: `Los Angeles street scene - wide palm-tree lined streets, low-rise buildings, that golden California light, maybe distant hills. Laid-back, sunny vibe.`,
  orlando: `Orlando suburban street - humid Florida feel, strip malls, palm trees, flat landscape, big sky with clouds. Quiet, almost empty roads.`,
  champaign: `Champaign-Urbana college town street - flat midwestern landscape, old brick campus buildings, wide streets, cornfields in the distance. Quiet, academic vibe.`,
  malecon: `The Puerto Vallarta Malecon boardwalk featuring the famous "El Caballito" bronze sculpture: a young boy sitting on top of a giant seahorse, the boy has one arm raised up reaching toward the sky. The sculpture has green-blue patina and sits on a dark stone pedestal. Behind it: the curved seaside promenade with decorative wrought iron railings, palm trees, Banderas Bay ocean, clear blue sky. The boy-on-seahorse statue is the central focus.`,

  cafe: `Interior of a cozy LA coffee shop - exposed brick wall on one side, white walls with hand-drawn murals and plant illustrations, industrial pendant lights hanging from ceiling, green-tiled coffee counter with espresso machine, burlap coffee bean sacks on the floor, wooden tables, warm inviting atmosphere. No people.`,
};

const ART_STYLE = `
Rough hand-drawn ink sketch style:
- ROUGH, LOOSE, SKETCHY lines - NOT clean or polished
- Lines should look hand-drawn with slight imperfections and varying thickness
- Messy, organic linework like a quick pen sketch in a notebook
- MOSTLY UNFILLED white space with scratchy ink lines
- Only one accent color (muted blue/teal) used sparingly
- Casual, effortless feel - like someone sketched this in 5 minutes
- NOT graphic design, NOT vector art, NOT polished illustration
- Think: loose ink drawing on paper, visible pen strokes, rough edges
- Imperfect and charming, not clean and corporate
- NO PEOPLE in the scene - empty streets
`;

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatterStr = match[1];
  const body = content.slice(match[0].length);
  const frontmatter = {};

  for (const line of frontmatterStr.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim());
      }
      frontmatter[key] = value;
    }
  }
  return { frontmatter, body };
}

/**
 * Generate using GPT Image Edit API with a reference image
 * This is how ChatGPT does "Ghibli-fy" style transformations
 */
async function generateWithReference(referenceImagePath) {
  const prompt = `Transform this photo into a rough hand-drawn ink sketch style illustration.

Keep the same composition, buildings, architecture, and location from the photo but redraw it as:
${ART_STYLE}

Keep all the landmarks and architectural details from the original photo.
Remove any people - make it an empty scene.
Make it 16:9 landscape aspect ratio.`;

  // Read the image file
  const imageBuffer = fs.readFileSync(referenceImagePath);
  const boundary = '----FormBoundary' + Math.random().toString(36).substring(2);

  // Get filename and determine content type
  const filename = path.basename(referenceImagePath);
  const ext = path.extname(referenceImagePath).toLowerCase();
  const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';

  // Build multipart form data
  let body = '';

  // Add model
  body += `--${boundary}\r\n`;
  body += 'Content-Disposition: form-data; name="model"\r\n\r\n';
  body += 'dall-e-2\r\n';

  // Add prompt
  body += `--${boundary}\r\n`;
  body += 'Content-Disposition: form-data; name="prompt"\r\n\r\n';
  body += prompt + '\r\n';

  // Add size (DALL-E 2 only supports 256x256, 512x512, 1024x1024)
  body += `--${boundary}\r\n`;
  body += 'Content-Disposition: form-data; name="size"\r\n\r\n';
  body += '1024x1024\r\n';

  // Convert the text parts to buffer
  const textParts = Buffer.from(body, 'utf8');

  // Add image header
  const imageHeader = Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="image"; filename="${filename}"\r\n` +
    `Content-Type: ${contentType}\r\n\r\n`,
    'utf8'
  );

  // Add closing boundary
  const closingBoundary = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');

  // Combine all parts
  const requestBody = Buffer.concat([textParts, imageHeader, imageBuffer, closingBoundary]);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/images/edits',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': requestBody.length
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`API error (${res.statusCode}): ${data}`));
          return;
        }
        try {
          const json = JSON.parse(data);
          // GPT Image returns base64 by default
          if (json.data[0].b64_json) {
            resolve({ base64: json.data[0].b64_json });
          } else if (json.data[0].url) {
            resolve({ url: json.data[0].url });
          } else {
            reject(new Error('No image data in response'));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

function generateLocationPrompt(location) {
  const locationKey = location.toLowerCase();
  const locationDesc = LOCATIONS[locationKey] || `${location} street scene - capture the unique character of this city's streets, architecture, and atmosphere.`;

  return `Create an illustration of a city street scene.

LOCATION: ${locationDesc}

${ART_STYLE}

COMPOSITION:
- Urban street-level perspective - like standing on a sidewalk looking down the street
- NO PEOPLE - empty streets, quiet city moment
- Buildings, street lights, power lines, signs, train tracks if relevant
- Off-white or cream paper background - like drawn on sketch paper
- Loose, rough sketch lines, hand-drawn feel
- Muted blue/teal as the only accent color
- NO text, words, or readable letters in the image
- 16:9 landscape ratio
- Should look like a page torn from an artist's travel sketchbook`;
}

async function generateImageDallE(prompt) {
  const requestBody = JSON.stringify({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1792x1024',
    quality: 'standard',
    response_format: 'url'
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`API error (${res.statusCode}): ${data}`));
          return;
        }
        const json = JSON.parse(data);
        if (json.data[0].b64_json) {
          resolve({ base64: json.data[0].b64_json });
        } else if (json.data[0].url) {
          resolve({ url: json.data[0].url });
        }
      });
    });
    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

function updateFrontmatter(content, imagePath) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  if (!match) return content;

  let frontmatterStr = match[1];
  if (frontmatterStr.includes('image:')) {
    frontmatterStr = frontmatterStr.replace(/image:.*/, `image: ${imagePath}`);
  } else {
    frontmatterStr += `\nimage: ${imagePath}`;
  }
  return content.replace(frontmatterRegex, `---\n${frontmatterStr}\n---`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node scripts/generate-thumbnail.js <blog-post> <location>');
    console.log('  node scripts/generate-thumbnail.js <blog-post> --ref <image-path>');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/generate-thumbnail.js blog/my-post.md chicago');
    console.log('  node scripts/generate-thumbnail.js blog/my-post.md --ref ./malecon.jpg');
    console.log('');
    console.log('Locations: chicago, manila, la, orlando, champaign, malecon');
    process.exit(1);
  }

  const blogPostPath = args[0];
  const fullPath = path.resolve(process.cwd(), blogPostPath);

  if (!fs.existsSync(fullPath)) {
    console.error(`Error: File not found: ${fullPath}`);
    process.exit(1);
  }

  console.log(`Reading blog post: ${blogPostPath}`);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const { frontmatter } = parseFrontmatter(content);
  console.log(`Title: ${frontmatter.title}`);

  let result;

  // Check if using reference image
  const refIndex = args.indexOf('--ref');
  if (refIndex !== -1 && args[refIndex + 1]) {
    const refImagePath = path.resolve(process.cwd(), args[refIndex + 1]);
    if (!fs.existsSync(refImagePath)) {
      console.error(`Error: Reference image not found: ${refImagePath}`);
      process.exit(1);
    }

    console.log(`Using reference image: ${refImagePath}`);
    console.log('Calling GPT Image Edit API to transform...');
    result = await generateWithReference(refImagePath);
  } else {
    // Use location-based generation
    const location = args[1] || 'chicago';
    console.log(`Location: ${location}`);
    console.log('Generating image prompt...');

    const prompt = generateLocationPrompt(location);

    console.log('Calling GPT Image API...');
    result = await generateImageDallE(prompt);
  }

  console.log('Image generated successfully!');

  const slug = frontmatter.slug || path.basename(blogPostPath, '.md').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const outputFilename = `${slug}-thumbnail.png`;
  const outputDir = path.resolve(process.cwd(), 'static/img/blog');
  const outputPath = path.join(outputDir, outputFilename);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save the image (either from base64 or URL)
  if (result.base64) {
    console.log(`Saving image to: ${outputPath}`);
    const imageBuffer = Buffer.from(result.base64, 'base64');
    fs.writeFileSync(outputPath, imageBuffer);
  } else if (result.url) {
    console.log(`Downloading image to: ${outputPath}`);
    await downloadImage(result.url, outputPath);
  }

  const imagePath = `/img/blog/${outputFilename}`;
  const updatedContent = updateFrontmatter(content, imagePath);
  fs.writeFileSync(fullPath, updatedContent);

  console.log(`Updated frontmatter with image: ${imagePath}`);
  console.log('\nDone!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
