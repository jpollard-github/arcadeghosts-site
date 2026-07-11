import type { getSiteSql } from "./database";
import type { SiteProject } from "./projects";

export type SiteSql = ReturnType<typeof getSiteSql>;

export type ProjectWrite = {
  project: SiteProject;
  lastUpdatedAt: string;
  displayOrder: number;
};

function projectInsertQuery(sql: SiteSql, write: ProjectWrite) {
  const { project, lastUpdatedAt, displayOrder } = write;

  return sql`
    INSERT INTO site_projects (
      id,
      type,
      title,
      description,
      href,
      image_url,
      status,
      phase,
      next_action,
      blockers,
      priority,
      last_updated_at,
      include_in_context_refresh,
      display_order
    )
    VALUES (
      ${project.id},
      ${project.type},
      ${project.title},
      ${project.description},
      ${project.href},
      ${project.imageUrl},
      ${project.status},
      ${project.phase},
      ${project.nextAction},
      ${project.blockers},
      ${project.priority},
      ${lastUpdatedAt || null},
      ${project.includeInContextRefresh},
      ${displayOrder}
    )
  `;
}

export async function saveProjectList(
  sql: SiteSql,
  writes: ProjectWrite[],
  existingIds: string[],
) {
  const savedIds = new Set(writes.map(({ project }) => project.id));
  const queries = writes.map((write) => {
    const { project, lastUpdatedAt, displayOrder } = write;

    return sql`
      INSERT INTO site_projects (
        id,
        type,
        title,
        description,
        href,
        image_url,
        status,
        phase,
        next_action,
        blockers,
        priority,
        last_updated_at,
        include_in_context_refresh,
        display_order
      )
      VALUES (
        ${project.id},
        ${project.type},
        ${project.title},
        ${project.description},
        ${project.href},
        ${project.imageUrl},
        ${project.status},
        ${project.phase},
        ${project.nextAction},
        ${project.blockers},
        ${project.priority},
        ${lastUpdatedAt || null},
        ${project.includeInContextRefresh},
        ${displayOrder}
      )
      ON CONFLICT (id)
      DO UPDATE SET
        type = EXCLUDED.type,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        href = EXCLUDED.href,
        image_url = EXCLUDED.image_url,
        status = EXCLUDED.status,
        phase = EXCLUDED.phase,
        next_action = EXCLUDED.next_action,
        blockers = EXCLUDED.blockers,
        priority = EXCLUDED.priority,
        last_updated_at = EXCLUDED.last_updated_at,
        include_in_context_refresh = EXCLUDED.include_in_context_refresh,
        display_order = EXCLUDED.display_order,
        updated_at = now()
    `;
  });

  for (const id of existingIds) {
    if (!savedIds.has(id)) {
      queries.push(sql`DELETE FROM site_projects WHERE id = ${id}`);
    }
  }

  await sql.transaction(queries);
}

export async function saveProjectOrder(
  sql: SiteSql,
  orderedIds: string[],
  existingIds: string[],
) {
  if (
    existingIds.length !== orderedIds.length ||
    existingIds.some((id) => !orderedIds.includes(id))
  ) {
    return false;
  }

  const queries = orderedIds.map((id, index) => sql`
    UPDATE site_projects
    SET display_order = ${index}, updated_at = now()
    WHERE id = ${id}
  `);
  await sql.transaction(queries);
  return true;
}

export async function deleteProjectAndReorder(
  sql: SiteSql,
  id: string,
  existingIds: string[],
) {
  if (existingIds.length <= 1) {
    return false;
  }

  const remainingIds = existingIds.filter((existingId) => existingId !== id);
  const queries = [sql`DELETE FROM site_projects WHERE id = ${id}`];

  for (let index = 0; index < remainingIds.length; index += 1) {
    queries.push(sql`
      UPDATE site_projects
      SET display_order = ${index}, updated_at = now()
      WHERE id = ${remainingIds[index]}
    `);
  }

  await sql.transaction(queries);
  return true;
}

export async function seedProjectDefaults(sql: SiteSql, projects: SiteProject[]) {
  const queries = projects.map((project, displayOrder) =>
    projectInsertQuery(sql, {
      project,
      lastUpdatedAt: project.lastUpdatedAt,
      displayOrder,
    }),
  );
  await sql.transaction(queries);
}
