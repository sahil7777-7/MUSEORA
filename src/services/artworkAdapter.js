/**
 * MUSEORA — Artwork Response Normalization Adapter
 * Maps raw Met Collection API records into a stable, typed UI view model.
 * Strict Rule: Does NOT fabricate facts, biographies, or synthetic dates.
 */

/**
 * Maps a Met department to an internal museum wing for spatial browsing.
 */
function resolveMuseumWing(department) {
  if (!department) return 'Sacred Antiquities Sanctuary';
  const depLower = department.toLowerCase();

  if (depLower.includes('european') || depLower.includes('painting')) {
    return 'Grand Renaissance Gallery';
  }
  if (depLower.includes('modern') || depLower.includes('contemporary')) {
    return 'Impressionist & Modern Masters';
  }
  if (depLower.includes('asian') || depLower.includes('islamic') || depLower.includes('egyptian') || depLower.includes('greek') || depLower.includes('roman')) {
    return 'Sacred Antiquities Sanctuary';
  }
  if (depLower.includes('sculpture') || depLower.includes('decorative') || depLower.includes('arms')) {
    return 'Hall of Classical Sculpture';
  }
  return 'The Metropolitan Wing';
}

/**
 * Resolves 3D representation archetype for the artwork viewer.
 */
function resolve3DType(classification, medium) {
  const text = `${classification || ''} ${medium || ''}`.toLowerCase();
  if (text.includes('paint') || text.includes('drawing') || text.includes('print') || text.includes('canvas') || text.includes('oil')) {
    return 'painting-frame';
  }
  if (text.includes('marble') || text.includes('stone') || text.includes('limestone') || text.includes('plaster')) {
    return 'sculpture-marble';
  }
  if (text.includes('digital') || text.includes('hologram') || text.includes('neural')) {
    return 'digital-cube';
  }
  return 'sculpture-bronze';
}

/**
 * Normalizes a raw Met Museum API object record.
 * @param {object} raw Raw object from `/objects/{id}`
 * @returns {object|null} Normalized artwork model
 */
export function normalizeMetArtwork(raw) {
  if (!raw || !raw.objectID) return null;

  const id = `met-${raw.objectID}`;
  const title = (raw.title && raw.title.trim()) || 'Untitled Masterwork';
  const artist = (raw.artistDisplayName && raw.artistDisplayName.trim()) ||
    (raw.culture && raw.culture.trim()) ||
    'Unknown Master';
  const artistBio = (raw.artistDisplayBio && raw.artistDisplayBio.trim()) || null;
  const year = (raw.objectDate && raw.objectDate.trim()) || 'Historical Era';
  const medium = (raw.medium && raw.medium.trim()) || 'Museum Artifact';
  const dimensions = (raw.dimensions && raw.dimensions.trim()) || 'Standard Museum Display';
  const department = (raw.department && raw.department.trim()) || 'The Metropolitan Collection';
  const location = (raw.repository && raw.repository.trim()) || 'The Metropolitan Museum of Art, New York';
  const category = (raw.classification && raw.classification.trim()) || 'Artifacts';

  const image = raw.primaryImageSmall || raw.primaryImage || '';
  const highResImage = raw.primaryImage || raw.primaryImageSmall || '';
  const additionalImages = Array.isArray(raw.additionalImages)
    ? raw.additionalImages.filter((img) => typeof img === 'string' && img.length > 0)
    : [];

  const hasImage = Boolean(image);
  const isPublicDomain = Boolean(raw.isPublicDomain);
  const objectUrl = raw.objectURL || `https://www.metmuseum.org/art/collection/search/${raw.objectID}`;

  // Description built strictly from verified metadata
  const descParts = [
    `"${title}"`,
    artist !== 'Unknown Master' ? `attributed to ${artist}` : '',
    year !== 'Historical Era' ? `(${year})` : '',
    `is cataloged in the ${department} at ${location}.`,
    medium !== 'Museum Artifact' ? `Created using ${medium}.` : '',
    raw.creditLine ? `Acquisition: ${raw.creditLine}.` : '',
  ].filter(Boolean);

  const description = descParts.join(' ');
  const provenance = raw.creditLine
    ? `Official Accession: ${raw.creditLine}. Catalog Object ID #${raw.objectID}.`
    : `The Met Collection Accession, Object ID #${raw.objectID}.`;

  const room = resolveMuseumWing(department);
  const threeDType = resolve3DType(category, medium);

  return {
    id,
    metId: raw.objectID,
    title,
    artist,
    artistBio,
    year,
    era: raw.period || department,
    medium,
    dimensions,
    department,
    culture: raw.culture || '',
    location,
    category,
    image,
    highResImage,
    additionalImages,
    hasImage,
    isPublicDomain,
    objectUrl,
    description,
    provenance,
    room,
    threeDType,
    // Source attribution compliance
    source: 'The Metropolitan Museum of Art',
    sourceUrl: objectUrl,
  };
}
