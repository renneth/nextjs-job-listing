import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import jobs from "../../../data.json";
import ApplyButton from "./apply-button";

type Job = {
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

type PageProps = {
	params: Promise<{
		slug: string;
	}>;
};

const allJobs = jobs as Job[];

function getJobBySlug(slug: string) {
	return allJobs.find((job) => job.slug === slug);
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat("en-NZ", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}

function formatClosingDate(value: string | null) {
	return value ? formatDate(value) : "Open until filled";
}

function formatSalaryRange(job: Job) {
	const formatter = new Intl.NumberFormat("en-NZ", {
		style: "currency",
		currency: job.salary.currency,
		maximumFractionDigits: 0,
	});

	return `${formatter.format(job.salary.min)} - ${formatter.format(job.salary.max)}`;
}

export function generateStaticParams() {
	return allJobs.map((job) => ({
		slug: job.slug,
	}));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const job = getJobBySlug(slug);

	if (!job) {
		notFound();
	}

	return {
		title: `${job.title} | Provider Job Listings`,
		description: `View details for the ${job.title} role in ${job.location}.`,
	};
}

export default async function JobDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const job = getJobBySlug(slug);

	if (!job) {
		notFound();
	}

	/* Data flow: resolve the slug once on the server, then render the full record directly from the feed. */
	return (
		<main className="job-detail-page">
			<section className="job-detail-hero">
				<div className="job-detail-hero__meta">
					<span aria-hidden="true">&larr;</span>
					<Link className="" href="/">
						<p className="jobs-kicker">Back to all jobs</p>
					</Link>
				</div>
				<h1>{job.title}</h1>
				<p className="job-detail-hero__intro">
					Review the full role summary, requirements, and application details.
				</p>
			</section>

			<section className="job-detail-panel">
				{/* Summary flow: present the requested top-level job fields before the long-form content. */}
				<dl className="job-detail-meta">
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
						<dt>Salary range</dt>
						<dd>{formatSalaryRange(job)}</dd>
					</div>
					<div>
						<dt>Posted</dt>
						<dd>{formatDate(job.postedDate)}</dd>
					</div>
					<div>
						<dt>Closing date</dt>
						<dd>{formatClosingDate(job.closingDate)}</dd>
					</div>
				</dl>

				<div className="job-detail-layout">
					<div className="job-detail-content">
						{/* Content flow: render the provided HTML description and the plain-text requirements list. */}
						<section className="job-detail-section">
							<h2>Description</h2>
							<div
								className="job-detail-rich-text"
								dangerouslySetInnerHTML={{ __html: job.description }}
							/>
						</section>

						<section className="job-detail-section">
							<h2>Requirements</h2>
							<ul className="job-detail-requirements">
								{job.requirements.map((requirement) => (
									<li key={requirement}>{requirement}</li>
								))}
							</ul>
						</section>
					</div>

					<aside className="job-detail-aside">
						<div className="job-detail-cta">
							<h2>Apply for this role</h2>
							<p>
								Submit your interest for this position through the provider
								application process.
							</p>
							<ApplyButton
								department={job.department}
								jobId={job.id}
								jobSlug={job.slug}
								jobTitle={job.title}
							/>
						</div>
					</aside>
				</div>
			</section>
		</main>
	);
}
