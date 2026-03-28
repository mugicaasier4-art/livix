const ALLOWED_DOMAINS = [
  "img3.idealista.com",
  "img4.idealista.com",
  "st.idealista.com",
  "cdn.milanuncios.com",
  "fotos.milanuncios.com",
  "static.fotocasa.es",
  "img.pisos.com",
];

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const imageUrl = url.searchParams.get("url");

  if (!imageUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  if (!ALLOWED_DOMAINS.some((d) => parsedUrl.hostname.endsWith(d))) {
    return new Response("Domain not allowed", { status: 403 });
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "image/*",
      },
    });

    if (!response.ok) {
      return new Response("Image not available", {
        status: 404,
        headers: { "Cache-Control": "public, max-age=3600" },
      });
    }

    const body = response.body;
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response("Fetch error", { status: 502 });
  }
});
