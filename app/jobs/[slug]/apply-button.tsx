"use client";

type ApplyButtonProps = {
	jobId: string;
	jobSlug: string;
	jobTitle: string;
	department: string;
};

declare global {
	interface Window {
		dataLayer?: Array<Record<string, unknown>>;
	}
}

export default function ApplyButton({
	jobId,
	jobSlug,
	jobTitle,
	department,
}: ApplyButtonProps) {
	function handleClick() {
		window.dataLayer = window.dataLayer ?? [];

		/* Analytics flow: push a GTM-style event payload that mirrors a real apply-click event. */
		window.dataLayer.push({
			event: "job_apply_click",
			jobId,
			jobSlug,
			jobTitle,
			department,
		});
	}

	return (
		<button className="job-detail__apply" onClick={handleClick} type="button">
			Apply Now
		</button>
	);
}
