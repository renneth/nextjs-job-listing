import type { Metadata } from "next";
import Link from "next/link";
import jobs from "../data.json";

type Job = {
	id: string;
	title: string;
	slug: string;
	location: string;
	type: string;
	department: string;
	postedDate: string;
};

type SearchParams = Promise<{
	department?: string | string[];
	type?: string | string[];
}>;

export const metadata: Metadata = {
	alternates: {
		canonical: "/",
	},
};

const allJobs = jobs as Job[];
const departmentOptions = [
	...new Set(allJobs.map((job) => job.department)),
].sort();
const typeOptions = [...new Set(allJobs.map((job) => job.type))].sort();

function getSingleValue(value: string | string[] | undefined) {
	return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function formatPostedDate(value: string) {
	return new Intl.DateTimeFormat("en-NZ", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}

export default async function Home({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const resolvedSearchParams = await searchParams;

	/* Filter state flow: read query params once, normalize them, then filter the in-memory dataset. */
	const selectedDepartment = getSingleValue(resolvedSearchParams.department);
	const selectedType = getSingleValue(resolvedSearchParams.type);

	const filteredJobs = allJobs.filter((job) => {
		const matchesDepartment =
			selectedDepartment === "" || job.department === selectedDepartment;
		const matchesType = selectedType === "" || job.type === selectedType;

		return matchesDepartment && matchesType;
	});

	return (
		<main className="jobs-page">
			<section className="jobs-hero">
				<p className="jobs-kicker">Provider opportunities</p>
				<h1>Clinical roles across New Zealand</h1>
				<p className="jobs-intro">
					Browse current openings for specialist and primary care providers.
				</p>
			</section>

			<section className="jobs-panel">
				{/* Filter UI flow: submit a native GET form so the selected state stays in the URL. */}
				<form className="jobs-filters" method="get">
					<label className="jobs-field">
						<span>Department</span>
						<select name="department" defaultValue={selectedDepartment}>
							<option value="">All departments</option>
							{departmentOptions.map((department) => (
								<option key={department} value={department}>
									{department}
								</option>
							))}
						</select>
					</label>

					<label className="jobs-field">
						<span>Employment type</span>
						<select name="type" defaultValue={selectedType}>
							<option value="">All types</option>
							{typeOptions.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</label>

					<div className="jobs-actions">
						<button type="submit">Apply filters</button>
						<Link href="/">Clear</Link>
					</div>
				</form>

				<p className="jobs-summary">
					{filteredJobs.length} role{filteredJobs.length === 1 ? "" : "s"}{" "}
					available
				</p>

				{/* Listing flow: render only the fields required by the exam prompt. */}
				<div className="jobs-list" aria-live="polite">
					{filteredJobs.length > 0 ? (
						filteredJobs.map((job) => (
							<Link href={`/jobs/${job.slug}`} key={job.id}>
								<article className="job-card">
									<div className="job-card__header">
										<p className="job-card__eyebrow">{job.department}</p>
										<h2>{job.title}</h2>
									</div>

									<dl className="job-card__meta">
										<div>
											<dt>Location</dt>
											<dd>{job.location}</dd>
										</div>
										<div>
											<dt>Type</dt>
											<dd>{job.type}</dd>
										</div>
										<div>
											<dt>Department</dt>
											<dd>{job.department}</dd>
										</div>
										<div>
											<dt>Posted</dt>
											<dd>{formatPostedDate(job.postedDate)}</dd>
										</div>
									</dl>
								</article>
							</Link>
						))
					) : (
						<p className="jobs-empty">No roles match the selected filters.</p>
					)}
				</div>
			</section>
		</main>
	);
}
