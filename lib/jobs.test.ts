import { describe, expect, it } from "vitest";
import { filterJobs, getAllJobSlugs, getJobBySlug } from "./jobs";

describe("job routing helpers", () => {
	it("returns all known slugs for dynamic routing and sitemap generation", () => {
		expect(getAllJobSlugs()).toEqual([
			"paediatrician",
			"emergency-medicine-physician",
			"general-practitioner",
			"consultant-anaesthetist",
			"psychiatrist",
		]);
	});

	it("looks up a job by slug and returns undefined for missing slugs", () => {
		expect(getJobBySlug("psychiatrist")?.title).toBe("Psychiatrist");
		expect(getJobBySlug("missing-role")).toBeUndefined();
	});
});

describe("job filters", () => {
	it("filters by department", () => {
		const result = filterJobs({ department: "Paediatrics" });

		expect(result).toHaveLength(1);
		expect(result[0]?.slug).toBe("paediatrician");
	});

	it("filters by employment type", () => {
		const result = filterJobs({ type: "Contract" });

		expect(result).toHaveLength(1);
		expect(result[0]?.slug).toBe("psychiatrist");
	});

	it("applies department and employment type together", () => {
		const result = filterJobs({
			department: "Mental Health",
			type: "Contract",
		});

		expect(result).toHaveLength(1);
		expect(result[0]?.slug).toBe("psychiatrist");
	});
});