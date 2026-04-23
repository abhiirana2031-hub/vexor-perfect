export const Head = () => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#03050a" />
      
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
    </>
  );
};
