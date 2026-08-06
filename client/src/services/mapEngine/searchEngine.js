import campusGraphData from '../../data/campus_graph.json';

/**
 * Search campus locations with autocomplete filtering
 * @param {string} query - Search term
 * @param {Array} customNodes - Optional custom node list
 * @returns {Array} List of matching node objects
 */
export const searchCampusLocations = (query = '', customNodes = campusGraphData.nodes) => {
  if (!query || query.trim() === '') {
    return customNodes.filter((n) => n.category !== 'Intersection');
  }

  const q = query.toLowerCase().trim();

  return customNodes.filter((node) => {
    if (node.category === 'Intersection') return false;

    const nameMatch = node.name.toLowerCase().includes(q);
    const codeMatch = node.code.toLowerCase().includes(q);
    const categoryMatch = node.category.toLowerCase().includes(q);
    const deptMatch = node.departments && node.departments.some((d) => d.toLowerCase().includes(q));
    const descMatch = node.description && node.description.toLowerCase().includes(q);

    return nameMatch || codeMatch || categoryMatch || deptMatch || descMatch;
  });
};

/**
 * Get all available campus location categories
 */
export const getCampusCategories = (customNodes = campusGraphData.nodes) => {
  const categories = new Set();
  customNodes.forEach((node) => {
    if (node.category && node.category !== 'Intersection') {
      categories.add(node.category);
    }
  });
  return ['All', ...Array.from(categories)];
};
