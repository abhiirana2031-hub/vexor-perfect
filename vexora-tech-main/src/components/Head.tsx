export const Head = () => {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Vexor IT Solutions",
    "image": "https://vexoritsolutions.site/vexor-logo.png",
    "@id": "https://vexoritsolutions.site/#organization",
    "url": "https://vexoritsolutions.site",
    "telephone": "+917599544335",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Meerut Bypass",
      "addressLocality": "Meerut",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "250001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.9845,
      "longitude": 77.7064
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://github.com/vexora-tech"
    ]
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#000000" />
      
      {/* Primary SEO Meta Tags */}
      <meta name="description" content="Vexor IT Solutions is a boutique software development agency. We engineer custom digital products, secure web applications, and high-performance cloud architectures." />
      <meta name="keywords" content="software development, web application development, custom software, IT solutions, system design, cloud architecture, Vexor, Meerut, Abhay Rana" />
      <meta name="author" content="Abhay Rana" />
      <link rel="canonical" href="https://vexoritsolutions.site" />

      {/* Geotargeting & Local SEO Meta Tags */}
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Meerut" />
      <meta name="geo.position" content="28.9845;77.7064" />
      <meta name="ICBM" content="28.9845, 77.7064" />

      {/* Open Graph / Facebook Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://vexoritsolutions.site" />
      <meta property="og:title" content="Vexor IT Solutions - Bespoke Software Development" />
      <meta property="og:description" content="We merge rigorous software engineering with intentional design to build secure, scalable, and high-performance digital products." />
      <meta property="og:image" content="https://vexoritsolutions.site/vexor-logo.png" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://vexoritsolutions.site" />
      <meta name="twitter:title" content="Vexor IT Solutions - Bespoke Software Development" />
      <meta name="twitter:description" content="We merge rigorous software engineering with intentional design to build secure, scalable, and high-performance digital products." />
      <meta name="twitter:image" content="https://vexoritsolutions.site/vexor-logo.png" />

      {/* Favicon / Branding */}
      <link rel="icon" href="/vexor-logo.svg" type="image/svg+xml" />
      <link rel="icon" href="/vexor-logo.png" type="image/png" />
      <link rel="apple-touch-icon" href="/vexor-logo.png" />
      <link rel="shortcut icon" href="/vexor-logo.png" type="image/png" />
      
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,301,701,300,501,401,901,400&display=swap" rel="stylesheet" />
      <link rel="preconnect" href="https://static.parastorage.com" />

      {/* JSON-LD LocalBusiness Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
    </>
  );
};
