// Contracts:
//   mapRequestRow(row)  -> { id, title, description, priority, status,
//                             createdAt, updatedAt }
//   mapHistoryRow(row)  -> { previousStatus, newStatus, changedAt }

export function mapRequestRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapHistoryRow(row) {
  if (!row) return null;
  return {
    previousStatus: row.previous_status,
    newStatus: row.new_status,
    changedAt: row.changed_at
  };
} 