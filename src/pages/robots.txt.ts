import type { APIRoute } from "astro";

function getSiteUrl() {
    const rawSiteUrl = import.meta.env.PUBLIC_SITE_URL || "https://foxcode.pe";

    return rawSiteUrl.endsWith("/") ? rawSiteUrl : `${rawSiteUrl}/`;
}

export const GET: APIRoute = () => {
    const siteUrl = getSiteUrl();
    const body = [
        "User-agent: *",
        "Allow: /",
        "",
        `Sitemap: ${new URL("/sitemap.xml", siteUrl).toString()}`,
        "",
    ].join("\n");

    return new Response(body, {
        headers: {
            "content-type": "text/plain; charset=utf-8",
        },
    });
};
