import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "404 - Job Not Found",
	description: "The job you are looking for does not exist.",
};

export default function JobNotFound() {
	return (
		<main className="job-detail-page">
			<section className="job-detail-not-found">
				<p className="jobs-kicker">Job listing</p>
				<h1>Job not found</h1>
				<p>The requested role could not be found in the current job feed.</p>
				<Link href="/">Return to all jobs</Link>
			</section>
		</main>
	);
}
