import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
	buildJobPostingStructuredData,
	formatClosingDate,
	formatDisplayDate,
	formatSalaryRange,
	getAllJobSlugs,
	getJobBySlug,
	siteName,
} from "@/lib/jobs";
import ApplyButton from "./apply-button";

type PageProps = {
	params: Promise<{
		slug: string;
	}>;
};

export function generateStaticParams() {
	return getAllJobSlugs().map((slug) => ({
		slug,
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

	const description = `View details for the ${job.title} role in ${job.location}.`;

	return {
		title: job.title,
		description,
		alternates: {
			canonical: `/jobs/${job.slug}`,
		},
		openGraph: {
			description,
			title: `${job.title} | ${siteName}`,
			type: "article",
			url: `/jobs/${job.slug}`,
		},
	};
}

export default async function JobDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const job = getJobBySlug(slug);

	if (!job) {
		notFound();
	}

	const jobPostingStructuredData = buildJobPostingStructuredData(job);

	/* Data flow: resolve the slug once on the server, then render the full record directly from the feed. */
	return (
		<main className="job-detail-page">
			{/* Structured data flow: publish a JobPosting record that matches the visible job detail content. */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(jobPostingStructuredData),
				}}
			/>

			<section className="job-detail-hero">
				<div className="job-detail-hero__meta">
					<Link className="job-detail-back" href="/">
						<span aria-hidden="true">&larr;</span>
						Back to all jobs
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
						<dd>{formatDisplayDate(job.postedDate)}</dd>
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
