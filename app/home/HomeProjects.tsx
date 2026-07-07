import Image from "next/image";
import { SectionHeading } from "../SectionHeading";
import { TrackedLink } from "../TrackedLink";
import type { SiteProject } from "../lib/projects";
import { formatProjectDate, projectCta, projectStatusLabels } from "./project-helpers";

function projectSurfaceLabel(href: string) {
  if (!href) {
    return "";
  }

  try {
    const url = new URL(href);

    return url.hostname === "github.com" ? "External repo" : "External site";
  } catch {
    return "On this site";
  }
}

function meaningfulText(value: string) {
  const trimmed = value.trim();

  return trimmed && trimmed.toLowerCase() !== "none" ? trimmed : "";
}

function blockerLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line.toLowerCase() !== "none");
}

export function HomeProjects({ projects }: { projects: SiteProject[] }) {
  return (
    <section className="content-section" id="projects">
      <SectionHeading eyebrow="Projects" title="Shipped, active, paused, and becoming.">
        The workbench: products, games, tools, and experiments with visible
        status so the site feels current instead of frozen in amber.
      </SectionHeading>
      <div className="card-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            {project.imageUrl ? (
              <div className="project-image-wrap">
                <Image
                  src={project.imageUrl}
                  alt={`${project.title} project image`}
                  fill
                  sizes="(max-width: 700px) calc(100vw - 3rem), (max-width: 1120px) calc(50vw - 2.25rem), calc((100vw - 4rem) / 3)"
                  className="project-image"
                />
              </div>
            ) : null}
            <div className="project-card-meta">
              <p className="card-eyebrow">{project.type}</p>
              <span>{projectStatusLabels.get(project.status) ?? project.status}</span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-details" aria-label={`${project.title} details`}>
              <p>
                <strong>Where it lives:</strong> {projectSurfaceLabel(project.href) || "TBD"}
              </p>
              {project.phase ? (
                <p>
                  <strong>Current phase:</strong> {project.phase}
                </p>
              ) : null}
              {meaningfulText(project.nextAction) ? (
                <p>
                  <strong>Next move:</strong> {project.nextAction}
                </p>
              ) : null}
              {blockerLines(project.blockers).length ? (
                <div className="project-blockers">
                  <strong>
                    Current blocker{blockerLines(project.blockers).length > 1 ? "s" : ""}:
                  </strong>
                  <ul>
                    {blockerLines(project.blockers).map((blocker) => (
                      <li key={blocker}>{blocker}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            {project.lastUpdatedAt ? (
              <p className="project-updated">
                Last updated {formatProjectDate(project.lastUpdatedAt)}
              </p>
            ) : null}
            {project.href ? (
              <TrackedLink
                className="project-link"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                trackingEvent="project_link_click"
                trackingProperties={{
                  project_id: project.id,
                  surface: "home_projects",
                  status: project.status,
                }}
              >
                {projectCta(project.href)}
              </TrackedLink>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
