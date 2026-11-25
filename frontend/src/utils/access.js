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
      .map(({ school_id }) => String(school_id || ''))
      .filter((schoolId) => normalize(schoolId)),
  );
  const labels = [...new Set([...schoolIds].map(normalize))];
  return {
    schoolIds,
    label: labels.length ? labels.join(', ') : 'No school assigned',
  };
}
