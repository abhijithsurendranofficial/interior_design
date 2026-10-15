# Live Space — Interior Design Studio

A responsive, multi-page brochure site for Live Space, an interior design studio in Kottayam. The site uses semantic HTML, custom CSS and vanilla JavaScript; it has no build step or package dependencies.

## Open locally

Open `index.html` in a modern browser. All page links and interactions work from local files. An internet connection is needed for Google Fonts, Unsplash photos and the embedded Kottayam map.

## Project structure

```text
.
├── index.html          Home page
├── about.html          Studio story, philosophy and team
├── services.html       Five detailed service descriptions
├── portfolio.html      Filterable project gallery and accessible lightbox
├── contact.html        Enquiry form, studio details and map
├── css/
│   └── style.css       Shared styles, responsive layouts and design tokens
├── js/
│   └── main.js         Navigation, reveals, stats, sliders, gallery and forms
└── README.md
```

The original starter's `products.html`, `site.css`, `site.js` and `assets/workshop-hero.png` are not referenced by the Live Space pages.

## Change the studio details

- Update `[PHONE]`, `[EMAIL]`, `[ADDRESS]` and `[WHATSAPP NUMBER]` in the contact details and footer in each HTML page. Keep the displayed details consistent across pages.
- In `js/main.js`, set `whatsappNumber` to the confirmed number with country code and digits only (for example, `919876543210`). Until set, the floating contact button opens the enquiry form.
- Replace the Instagram, Pinterest and Facebook URLs in the footer of each HTML page with the studio's profile links.
- Replace the sample portfolio names, team portraits and testimonial copy with studio-approved project details and client quotes.
- Edit page titles, descriptions, headings and copy directly in the corresponding HTML file. Update each page's description and Open Graph tags along with its content.

## Replace the images

All page photos currently use Unsplash image URLs so the site can be previewed immediately. Replace the `src` and `srcset` URLs on `<img>` elements with your own optimized images and keep the descriptive `alt` text accurate. The portfolio's `data-full` attribute should point to its larger lightbox image. The full-page CTA photos are CSS backgrounds in `css/style.css` under `.cta-image`; replace those URLs as well. Use AVIF or WebP where available, provide appropriately sized variants, and keep `loading="lazy"` for below-the-fold images. The home hero is intentionally loaded eagerly for its first-screen display.

## Change brand colors and type

Edit the custom properties at the top of `css/style.css`:

```css
:root {
  --color-bg: #faf8f5;
  --color-text: #1c1c1c;
  --color-accent: #b08d57;
  --color-taupe: #e8e2d9;
  --color-espresso: #2a2420;
}
```

The current typefaces are Cormorant Garamond for headings and DM Sans for body copy, loaded from Google Fonts in each page's `<head>`. Update those font links and `--font-heading` / `--font-body` together if changing type.

## Forms and launch checklist

Contact and newsletter forms currently provide browser-side validation and an accessible confirmation state. They do not transmit or store submissions. Before launch, connect the forms to a provider such as Netlify Forms, Formspree or your own endpoint and update the submit handlers in `js/main.js` to send the data securely. Add spam protection and a privacy notice appropriate to the selected provider. Replace the bracketed contact details and generic social profile links before publishing.

The Google Maps iframe currently points to Kottayam, Kerala; change its search query and map link if the studio needs a more precise location.

## Deploy

This is a static site. Publish the project directory with any static host:

- **Netlify:** create a new site from the repository or drag the folder into Netlify Drop. No build command is needed; set the publish directory to the folder containing `index.html`.
- **Vercel:** import the repository, select the Other framework preset, leave build and output commands empty, and deploy the directory containing `index.html`.
- **GitHub Pages:** push the files to a repository, then enable Pages for the chosen branch and root (or the folder containing the HTML pages).

For production, add the final domain to social sharing metadata, configure a custom 404 page if desired, and verify the contact form after connecting its endpoint.
