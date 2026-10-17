import type { APIRoute } from "astro";
import { sitemapPages } from "@/core/SeoData";
import { getProjects } from "@/core/ProjectsData";

function getSiteUrl() {
    const rawSiteUrl = import.meta.env.PUBLIC_SITE_URL || "https://foxcode.pe";

    return rawSiteUrl.endsWith("/") ? rawSiteUrl : `${rawSiteUrl}/`;
}

function escapeXml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async () => {
    const siteUrl = getSiteUrl();
    const projectPaths = (await getProjects()).map((p) => `/proyectos/${p.id}`);
    const urls = [...sitemapPages.filter((page) => !page.noindex).map((page) => page.path), ...projectPaths]
        .map((path) => {
            const loc = new URL(path, siteUrl).toString();

            return [
                "  <url>",
                `    <loc>${escapeXml(loc)}</loc>`,
                "    <changefreq>weekly</changefreq>",
                "    <priority>0.8</priority>",
                "  </url>",
            ].join("\n");
        })
        .join("\n");
    const body = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        urls,
        "</urlset>",
        "",
    ].join("\n");

    return new Response(body, {
        headers: {
            "content-type": "application/xml; charset=utf-8",
        },
    });
};
