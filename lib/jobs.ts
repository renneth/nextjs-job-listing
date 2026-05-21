import jobsData from "../data.json";

export const siteName = "Job Listings Demo";
export const siteUrl = "https://nextjs-job-listing-psi.vercel.app";

export type Job = {
	id: string;
	title: string;
	slug: string;
	location: string;
	type: string;
	department: string;
	postedDate: string;
	closingDate: string | null;
	salary: {
		min: number;
		max: number;
		currency: string;
	};
	description: string;
	requirements: string[];
};

export type JobFilters = {
	department?: string;
	type?: string;
};

const allJobsFromFeed = jobsData as Job[];

/* Reviewer flow: keep feed access and all derived route helpers in one place so metadata, sitemap, pages, and tests share the same logic. */
export const allJobs = allJobsFromFeed;

export function normalizeFilterValue(value: string | string[] | undefined) {
	return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function getDepartmentOptions() {
	return [...new Set(allJobs.map((job) => job.department))].sort();
}

export function getEmploymentTypeOptions() {
	return [...new Set(allJobs.map((job) => job.type))].sort();
}

export function filterJobs({ department = "", type = "" }: JobFilters) {
	return allJobs.filter((job) => {
		const matchesDepartment = department === "" || job.department === department;
		const matchesType = type === "" || job.type === type;

		return matchesDepartment && matchesType;
	});
}

export function getJobBySlug(slug: string) {
	return allJobs.find((job) => job.slug === slug);
}

export function getAllJobSlugs() {
	return allJobs.map((job) => job.slug);
}

export function formatDisplayDate(value: string) {
	return new Intl.DateTimeFormat("en-NZ", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}

export function formatClosingDate(value: string | null) {
	return value ? formatDisplayDate(value) : "Open until filled";
}

export function formatSalaryRange(job: Job) {
	const formatter = new Intl.NumberFormat("en-NZ", {
		style: "currency",
		currency: job.salary.currency,
		maximumFractionDigits: 0,
	});

	return `${formatter.format(job.salary.min)} - ${formatter.format(job.salary.max)}`;
}

export function stripHtmlTags(value: string) {
	return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getAddressCountry(location: string) {
	const segments = location.split(",").map((segment) => segment.trim());
	return segments.at(-1) === "NZ" ? "NZ" : "NZ";
}

function getLocality(location: string) {
	return location.split(",")[0]?.replace("Remote", "").trim() || undefined;
}

export function buildJobPostingStructuredData(job: Job) {
	const isRemote = job.location.toLowerCase().includes("remote");
	const structuredData: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "JobPosting",
		title: job.title,
		description: stripHtmlTags(job.description),
		datePosted: job.postedDate,
		employmentType: job.type,
		occupationalCategory: job.department,
		directApply: true,
		identifier: {
			"@type": "PropertyValue",
			name: siteName,
			value: job.id,
		},
		hiringOrganization: {
			"@type": "Organization",
			name: siteName,
			sameAs: siteUrl,
		},
		baseSalary: {
			"@type": "MonetaryAmount",
			currency: job.salary.currency,
			value: {
				"@type": "QuantitativeValue",
				minValue: job.salary.min,
				maxValue: job.salary.max,
				unitText: "YEAR",
			},
		},
		url: `${siteUrl}/jobs/${job.slug}`,
	};

	if (job.closingDate) {
		structuredData.validThrough = job.closingDate;
	}

	if (isRemote) {
		structuredData.jobLocationType = "TELECOMMUTE";
		structuredData.applicantLocationRequirements = {
			"@type": "Country",
			name: getAddressCountry(job.location),
		};
	} else {
		structuredData.jobLocation = {
			"@type": "Place",
			address: {
				"@type": "PostalAddress",
				addressLocality: getLocality(job.location),
				addressCountry: getAddressCountry(job.location),
			},
		};
	}

	return structuredData;
}