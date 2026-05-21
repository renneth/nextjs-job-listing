import type { MetadataRoute } from "next";
import { getAllJobSlugs, siteUrl } from "@/lib/jobs";

/* Reviewer flow: keep sitemap generation data-driven from the same slug source used by routing. */
export default function sitemap(): MetadataRoute.Sitemap {
	const jobUrls = getAllJobSlugs().map((slug) => ({
		url: `${siteUrl}/jobs/${slug}`,
		lastModified: new Date(),
	}));

	return [
		{
			url: siteUrl,
			lastModified: new Date(),
		},
		...jobUrls,
	];
}