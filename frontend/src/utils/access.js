const normalize = (value) =>
  String(value || '')
    .trim()
    .toLowerCase();

export function formatRole(role) {
  return role === 'district_official' ? 'District official' : 'Teacher';
}

export function getDatabaseAccessScope(profile, assignments) {
  if (profile?.role === 'district_official') {
    return {
      schoolIds: null,
      label: 'All schools',
    };
  }
  const schoolIds = new Set(
    (assignments || [])
      .map(({ school_id }) => normalize(school_id))
      .filter(Boolean),
  );
  return {
    schoolIds,
    label: schoolIds.size ? [...schoolIds].join(', ') : 'No school assigned',
  };
}
