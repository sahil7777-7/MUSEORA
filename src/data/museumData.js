/**
 * MUSEORA — Master Real Museum Dataset
 * Authentic masterworks, public domain artwork images, historical provenances,
 * real artist biographies, and curatorial audio narration scripts.
 */

export const FEATURED_ARTIFACT = {
  id: 'the-thinker',
  title: 'THE THINKER (LE PENSEUR)',
  subtitle: 'A monumental bronze embodiment of philosophy and contemplative torment',
  artist: 'Auguste Rodin',
  artistId: 'auguste-rodin',
  year: '1904',
  era: 'Modern Sculpture & Impressionism',
  medium: 'Cast Bronze with Dark Patina',
  dimensions: '189 cm × 98 cm × 140 cm',
  location: 'Musée Rodin, Paris, France',
  category: 'Sculpture',
  roomId: 'classical-sculpture',
  room: 'Hall of Classical Sculpture',
  image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=1200&auto=format&fit=crop',
  threeDType: 'sculpture-bronze',
  description:
    'Originally conceived in 1880 as part of Rodin\'s monumental portal "The Gates of Hell" (based on Dante\'s Inferno), The Thinker depicts Dante Alighieri leaning forward, hand supporting his chin, contemplating the epic tragic poem of human existence. Enlarged in 1904, it became one of the most recognized bronze sculptures in human history.',
  provenance:
    'Commissioned in 1880 by the French Ministry of Fine Arts. The first large-scale bronze casting was completed by foundry Alexis Rudier in 1904 and placed outside the Panthéon before transfer to the Musée Rodin in 1922.',
  audioDuration: '02:45',
  audioScript:
    'Notice how Rodin didn\'t portray a calm, detached philosopher, but rather a muscular man straining in physical effort. Every muscle in the back, hand, and toes is tensed, representing thought as an active, heroic physical struggle.',
};

export const ARTWORKS = [
  FEATURED_ARTIFACT,
  {
    id: 'chola-nataraja',
    title: 'CHOLA NATARAJA (LORD OF COSMIC DANCE)',
    subtitle: 'An 11th-century Tamil Nadu bronze representing creation, preservation, and destruction',
    artist: 'Chola Royal Bronze Guild',
    artistId: 'chola-guild',
    year: 'c. 1050 CE',
    era: 'Chola Empire (South India)',
    medium: 'Lost-Wax Cast Bronze (Panchaloha alloy)',
    dimensions: '111.5 cm × 83.8 cm × 28 cm',
    location: 'Metropolitan Museum of Art, New York',
    category: 'Artifacts',
    roomId: 'ancient-heritage',
    room: 'Sacred Antiquities Sanctuary',
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1200&auto=format&fit=crop',
    threeDType: 'sculpture-bronze',
    description:
      'Shiva as Nataraja dances within a flaming halo of cosmic energy (prabhamandala), raising the drum of creation (damaru) in his upper right hand and holding the flame of destruction (agni) in his upper left. His right foot tramples the demon of ignorance (Apasmara), while his hair thrashes with cosmic power.',
    provenance:
      'Cast during the reign of King Rajendra Chola I in Thanjavur. Acquired by John D. Rockefeller III and gifted to the Metropolitan Museum of Art in 1979.',
    audioDuration: '03:15',
    audioScript:
      'Physicist Fritjof Capra noted that the Nataraja dance mirrors modern subatomic physics: the rhythmic cycle of creation and destruction of matter in quantum particle fields.',
  },
  {
    id: 'mona-lisa',
    title: 'MONA LISA (LA GIOCONDA)',
    subtitle: 'Leonardo da Vinci\'s Renaissance masterpiece renowned for sfumato technique and enigmatic gaze',
    artist: 'Leonardo da Vinci',
    artistId: 'leonardo-da-vinci',
    year: '1503–1519',
    era: 'High Italian Renaissance',
    medium: 'Oil on Lombardy Poplar Panel',
    dimensions: '77 cm × 53 cm',
    location: 'Musée du Louvre, Paris',
    category: 'Painting',
    roomId: 'renaissance-hall',
    room: 'Grand Renaissance Gallery',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    threeDType: 'painting-frame',
    description:
      'Depicting Lisa Gherardini, wife of Florentine merchant Francesco del Giocondo, this painting revolutionized portraiture with its subtle sfumato atmospheric gradations, aerial perspective background, and psycho-optical mysterious smile.',
    provenance:
      'Acquired by King Francis I of France in 1518 following Leonardo\'s death at Château du Clos Lucé. Housed in Versailles until its permanent installation at the Louvre after the French Revolution.',
    audioDuration: '03:40',
    audioScript:
      'Leonardo applied over thirty microscopic glazes of oil paint, each thinner than a human hair, creating the illusion of translucent skin illuminated from within.',
  },
  {
    id: 'starry-night',
    title: 'THE STARRY NIGHT',
    subtitle: 'Van Gogh\'s swirling celestial nightscape painted from Saint-Paul-de-Mausole',
    artist: 'Vincent van Gogh',
    artistId: 'vincent-van-gogh',
    year: '1889',
    era: 'Post-Impressionism',
    medium: 'Oil on Canvas',
    dimensions: '73.7 cm × 92.1 cm',
    location: 'Museum of Modern Art (MoMA), New York',
    category: 'Painting',
    roomId: 'impressionist-wing',
    room: 'Impressionist & Modern Masters',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
    threeDType: 'painting-frame',
    description:
      'Painted in June 1889 from Van Gogh\'s east-facing asylum window in Saint-Rémy-de-Provence just before sunrise, featuring turbulent rhythmic impasto night sky, glowing crescent moon, Eleven bright stars, and a towering dark cypress tree.',
    provenance:
      'Inherited by Jo van Gogh-Bonger in 1891; sold to Paul Rosenberg in 1938; acquired by the Museum of Modern Art through the Lillie P. Bliss Bequest in 1941.',
    audioDuration: '02:50',
    audioScript:
      'Fluid dynamics mathematicians discovered that Van Gogh\'s brushstrokes match the exact mathematical scaling equation for turbulent fluid flow discovered by Andrei Kolmogorov in 1941.',
  },
  {
    id: 'venus-de-milo',
    title: 'VENUS DE MILO (APHRODITE OF MILOS)',
    subtitle: 'An iconic Hellenistic Greek marble sculpture of divine beauty and grace',
    artist: 'Alexandros of Antioch',
    artistId: 'greek-sculptors',
    year: 'c. 130–100 BCE',
    era: 'Hellenistic Greece',
    medium: 'Parian Marble',
    dimensions: '204 cm (Height)',
    location: 'Musée du Louvre, Paris',
    category: 'Sculpture',
    roomId: 'classical-sculpture',
    room: 'Hall of Classical Sculpture',
    image: 'https://images.unsplash.com/photo-1544411047-c491e34a2465?q=80&w=1200&auto=format&fit=crop',
    threeDType: 'sculpture-marble',
    description:
      'Discovered on the Aegean island of Milos in 1820, this masterpiece combines the classical poise of Praxiteles with Hellenistic drama, featuring dynamic contrapposto balance and realistic drapery falling over the hips.',
    provenance:
      'Uncovered by peasant Yorgos Kentrotas in a ruined niche in Milos; presented to King Louis XVIII of France by the Marquis de Rivière and installed at the Louvre in 1821.',
    audioDuration: '02:30',
    audioScript:
      'Although missing both arms today, scholars believe her left arm originally held an apple or mirror, while her right arm held up her slipping drapery.',
  },
  {
    id: 'great-wave',
    title: 'THE GREAT WAVE OFF KANAGAWA',
    subtitle: 'Hokusai\'s iconic ukiyo-e woodblock print framing Mount Fuji',
    artist: 'Katsushika Hokusai',
    artistId: 'hokusai',
    year: '1831',
    era: 'Edo Period Japan',
    medium: 'Woodblock Print (Prussian Blue & Ink on Paper)',
    dimensions: '25.7 cm × 37.9 cm',
    location: 'Metropolitan Museum of Art, New York',
    category: 'Artifacts',
    roomId: 'ancient-heritage',
    room: 'Sacred Antiquities Sanctuary',
    image: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?q=80&w=1200&auto=format&fit=crop',
    threeDType: 'painting-frame',
    description:
      'The first print in Hokusai\'s series "Thirty-Six Views of Mount Fuji", depicting a colossal wave threatening boats off Kanagawa with claw-like foam crests framing the tranquil snow-capped peak of Mount Fuji in the background.',
    provenance:
      'Original Edo print series published by Nishimuraya Eijudō. Rare early impressions preserved at the Met Museum, British Museum, and Guimet Museum.',
    audioDuration: '02:20',
    audioScript:
      'Hokusai imported synthetic Prussian Blue pigment from Europe, allowing unprecedented depth and vivid cyan tones in Japanese woodcut art.',
  },
  {
    id: 'the-kiss-klimt',
    title: 'THE KISS (DER KUSS)',
    subtitle: 'Klimt\'s Golden Phase masterpiece celebrating romantic unity and shimmering geometry',
    artist: 'Gustav Klimt',
    artistId: 'klimt',
    year: '1907–1908',
    era: 'Vienna Secession & Art Nouveau',
    medium: 'Oil and Gold Leaf on Canvas',
    dimensions: '180 cm × 180 cm',
    location: 'Österreichische Galerie Belvedere, Vienna',
    category: 'Painting',
    roomId: 'impressionist-wing',
    room: 'Impressionist & Modern Masters',
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1200&auto=format&fit=crop',
    threeDType: 'painting-frame',
    description:
      'Depicting two lovers embraced on a grassy meadow, shrouded in shimmering gold leaf robes embellished with rectangular masculine patterns and circular floral feminine motifs.',
    provenance:
      'Purchased directly from the Kunstschau exhibition by the Austro-Hungarian Ministry of Culture in 1908 before Klimt had even fully finished the painting.',
    audioDuration: '02:40',
    audioScript:
      'Klimt was inspired by Byzantine mosaic gold vaults in Ravenna, applying genuine 24-karat gold, platinum, and silver leaf to achieve brilliant radiance.',
  },
  {
    id: 'rosetta-stone',
    title: 'THE ROSETTA STONE',
    subtitle: 'The ancient granodiorite key that unlocked Egyptian hieroglyphics',
    artist: 'Ptolemaic Royal Scribes',
    artistId: 'ptolemaic-scribes',
    year: '196 BCE',
    era: 'Ptolemaic Dynasty (Ancient Egypt)',
    medium: 'Granodiorite Stela Fragment',
    dimensions: '112.3 cm × 75.7 cm × 28.4 cm',
    location: 'British Museum, London',
    category: 'Artifacts',
    roomId: 'ancient-heritage',
    room: 'Sacred Antiquities Sanctuary',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1200&auto=format&fit=crop',
    threeDType: 'sculpture-marble',
    description:
      'Decreed at Memphis on behalf of King Ptolemy V, this stela features the same royal decree written in three scripts: Ancient Egyptian Hieroglyphs, Demotic script, and Ancient Greek, enabling Jean-François Champollion to decipher hieroglyphs in 1822.',
    provenance:
      'Discovered near Rashid (Rosetta) by French officer Pierre-François Bouchard in 1799; surrendered to British forces under the Treaty of Alexandria in 1801.',
    audioDuration: '03:00',
    audioScript:
      'Because Ancient Greek was already understood by scholars, comparing the Greek text against the unknown hieroglyphs unlocked 3,000 years of recorded Egyptian history.',
  },
  {
    id: 'digital-consciousness',
    title: 'NEURAL CONSCIOUSNESS #001',
    subtitle: 'Generative 3D algorithmic art reflecting digital neural networks',
    artist: 'MUSEORA Generative AI Lab',
    artistId: 'museora-lab',
    year: '2026',
    era: 'Digital Spatial Art',
    medium: 'Real-time Parametric Shader Code & Volumetric Light',
    dimensions: 'Procedural Infinite Resolution',
    location: 'MUSEORA Virtual Museum Main Vault',
    category: 'Digital',
    roomId: 'digital-future',
    room: 'Digital & Spatial Art Pavilion',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    threeDType: 'digital-cube',
    description:
      'A synthetic generative artwork rendered live using Three.js mathematical noise algorithms, simulating the synapse firing patterns of artificial neural intelligence.',
    provenance:
      'Minted as MUSEORA Masterpiece #001 on the decentralized digital museum registry.',
    audioDuration: '02:00',
    audioScript:
      'This work recalculates its geometry 60 times per second, guaranteeing that no two visitors ever see the exact same lighting frame.',
  }
];

export const ARTISTS = [
  {
    id: 'auguste-rodin',
    name: 'Auguste Rodin',
    years: '1840–1917',
    country: 'France',
    style: 'Modern Realism & Impressionist Sculpture',
    worksCount: 14,
    portrait: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=600&auto=format&fit=crop',
    bio:
      'François-Auguste-René Rodin is widely regarded as the founder of modern sculpture. He broke away from academic neoclassical traditions by emphasizing emotional vitality, textured clay modeling, and anatomical expressiveness.',
    timeline: [
      { year: '1840', event: 'Born in Paris, France.' },
      { year: '1880', event: 'Commissioned to create The Gates of Hell.' },
      { year: '1904', event: 'Unveiled the large-scale bronze Thinker.' },
      { year: '1917', event: 'Passed away in Meudon, leaving works to the French state.' }
    ]
  },
  {
    id: 'leonardo-da-vinci',
    name: 'Leonardo da Vinci',
    years: '1452–1519',
    country: 'Italy',
    style: 'High Renaissance Polymath',
    worksCount: 22,
    portrait: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
    bio:
      'Italian polymath of the High Renaissance whose areas of interest included painting, sculpture, architecture, science, music, mathematics, anatomy, geology, and astronomy.',
    timeline: [
      { year: '1452', event: 'Born in Vinci, Republic of Florence.' },
      { year: '1498', event: 'Completed The Last Supper in Milan.' },
      { year: '1503', event: 'Began painting Mona Lisa.' },
      { year: '1519', event: 'Passed away at Château du Clos Lucé, France.' }
    ]
  },
  {
    id: 'vincent-van-gogh',
    name: 'Vincent van Gogh',
    years: '1853–1890',
    country: 'Netherlands',
    style: 'Post-Impressionism',
    worksCount: 18,
    portrait: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop',
    bio:
      'Dutch Post-Impressionist painter who posthumously became one of the most famous and influential figures in Western art history.',
    timeline: [
      { year: '1853', event: 'Born in Zundert, Netherlands.' },
      { year: '1888', event: 'Moved to Arles and painted Sunflowers.' },
      { year: '1889', event: 'Painted The Starry Night in Saint-Rémy.' },
      { year: '1890', event: 'Passed away in Auvers-sur-Oise, France.' }
    ]
  },
  {
    id: 'katsushika-hokusai',
    name: 'Katsushika Hokusai',
    years: '1760–1849',
    country: 'Japan',
    style: 'Ukiyo-e Woodblock Printing',
    worksCount: 36,
    portrait: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?q=80&w=600&auto=format&fit=crop',
    bio:
      'Japanese ukiyo-e painter and printmaker of the Edo period, best known for his woodblock print series Thirty-Six Views of Mount Fuji.',
    timeline: [
      { year: '1760', event: 'Born in Katsushika district, Edo (Tokyo).' },
      { year: '1831', event: 'Published The Great Wave off Kanagawa.' },
      { year: '1849', event: 'Passed away at age 88 in Edo.' }
    ]
  }
];

export const ROOMS = [
  {
    id: 'classical-sculpture',
    title: 'HALL OF CLASSICAL SCULPTURE',
    subtitle: 'Marble masterpieces & monumental bronze casts',
    description: 'Housing Auguste Rodin’s Thinker, Venus de Milo, and Greco-Roman friezes under dramatic directional museum spotlighting.',
    count: '34 Masterworks',
    image: 'https://images.unsplash.com/photo-1544411047-c491e34a2465?q=80&w=1000&auto=format&fit=crop',
    visitors: '1,420 Active Viewers'
  },
  {
    id: 'ancient-heritage',
    title: 'SACRED ANTIQUITIES SANCTUARY',
    subtitle: 'Ancient Chola bronzes & Egyptian stelae',
    description: 'Preserving sacred relics from 1500 BCE to 1100 CE including the Chola Nataraja and Rosetta Stone.',
    count: '28 Sacred Objects',
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1000&auto=format&fit=crop',
    visitors: '980 Active Viewers'
  },
  {
    id: 'renaissance-hall',
    title: 'GRAND RENAISSANCE GALLERY',
    subtitle: 'High Italian & Northern Renaissance oil canvases',
    description: 'Displaying Leonardo da Vinci’s Mona Lisa, Michelangelo sketches, and Raphael compositions.',
    count: '42 Oil Canvases',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop',
    visitors: '2,150 Active Viewers'
  },
  {
    id: 'impressionist-wing',
    title: 'IMPRESSIONIST & MODERN MASTERS',
    subtitle: 'Van Gogh, Gustav Klimt, & Monet',
    description: 'Showcasing Starry Night, The Kiss, and vibrant post-impressionist color harmonies.',
    count: '50 Paintings',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1000&auto=format&fit=crop',
    visitors: '1,840 Active Viewers'
  },
  {
    id: 'digital-future',
    title: 'DIGITAL & SPATIAL ART PAVILION',
    subtitle: 'Real-time procedural shaders & generative AI',
    description: 'Exploring neural networks, volumetric 3D lights, and interactive generative code art.',
    count: '16 Generative Shaders',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    visitors: '670 Active Viewers'
  }
];

export const EXHIBITIONS = [
  {
    id: 'exhibit-bronze-empires',
    title: 'BRONZE EMPIRES: FROM CHOLA TO RODIN',
    period: 'SPECIAL EXHIBIT • OCT 2026 - MAR 2027',
    curator: 'Dr. Evelyn Vance & Senior Curatorial Board',
    room: 'Hall of Classical Sculpture',
    featuredCount: 12,
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=1200&auto=format&fit=crop',
    description:
      'A landmark dual exhibition tracing the lost-wax bronze casting traditions of 11th-century Tamil Nadu alongside 19th-century French monumental bronze sculpting.'
  },
  {
    id: 'exhibit-renaissance-shadows',
    title: 'SFUMATO: THE SHADOWS OF LEONARDO',
    period: 'SPECIAL EXHIBIT • NOV 2026 - APR 2027',
    curator: 'Jean-Luc Moreau, Louvre Senior Restorer',
    room: 'Grand Renaissance Gallery',
    featuredCount: 8,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    description:
      'High-resolution multi-spectral analysis revealing the hidden underdrawings and translucent oil glazes of Mona Lisa and Renaissance masterworks.'
  }
];

export const TIMELINE_ERAS = [
  {
    year: '1500 BCE',
    eraTitle: 'Ancient Antiquity',
    headline: 'EGYPTIAN & MESOPOTAMIAN STONE STELAE',
    description: 'Royal decrees inscribed into granodiorite, papyrus scrolls, and bronze temple offerings.',
    artifactId: 'rosetta-stone',
    bgTone: '#12100D'
  },
  {
    year: '130 BCE',
    eraTitle: 'Hellenistic Greece',
    headline: 'THE HARMONY OF PARIAN MARBLE',
    description: 'Classical Greek sculptors master natural contrapposto balance and translucent marble carving.',
    artifactId: 'venus-de-milo',
    bgTone: '#171410'
  },
  {
    year: '1050 CE',
    eraTitle: 'Chola Dynasty',
    headline: 'PANCHALOHA LOST-WAX BRONZE CASTING',
    description: 'Imperial South Indian artisans cast sacred Nataraja figures expressing cosmic cycles.',
    artifactId: 'chola-nataraja',
    bgTone: '#1B1712'
  },
  {
    year: '1503 CE',
    eraTitle: 'High Renaissance',
    headline: 'THE SFUMATO REVOLUTION',
    description: 'Leonardo da Vinci perfects subtle atmospheric glazes and psychological portrait depth.',
    artifactId: 'mona-lisa',
    bgTone: '#15130F'
  },
  {
    year: '1889 CE',
    eraTitle: 'Post-Impressionism',
    headline: 'CELESTIAL IMPASTO TURBULENCE',
    description: 'Van Gogh paints rhythmically swirling night skies expressing emotional resonance.',
    artifactId: 'starry-night',
    bgTone: '#0E1116'
  },
  {
    year: '2026 CE',
    eraTitle: 'Digital Age',
    headline: 'GENERATIVE NEURAL SHADERS',
    description: 'Real-time procedural GPU code generating spatial 3D art dynamically.',
    artifactId: 'digital-consciousness',
    bgTone: '#0A1214'
  }
];

export const JOURNAL_POSTS = [
  {
    id: 'post-1',
    title: 'THE METALLURGY OF CHOLA BRONZES',
    date: 'OCTOBER 14, 2026',
    author: 'DR. ARUN PRASAD',
    category: 'CURATORIAL RESEARCH',
    readTime: '6 MIN READ',
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Analyzing the Panchaloha five-metal alloy ratios that gave 11th-century Chola bronzes their enduring luster and structural strength.'
  },
  {
    id: 'post-2',
    title: 'DECIPHERING LEONARDO\'S SFUMATO GLAZES',
    date: 'NOVEMBER 02, 2026',
    author: 'ELENA ROSTOVA',
    category: 'RESTORATION JOURNAL',
    readTime: '8 MIN READ',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    excerpt: 'X-ray fluorescence spectroscopy reveals how Leonardo da Vinci applied 30 microscopic layers of translucent paint.'
  }
];

export const EVENTS = [
  {
    id: 'event-1',
    title: 'LIVE 3D WALKTHROUGH: RODIN\'S STUDIO',
    date: 'NOV 18, 2026 • 18:00 UTC',
    location: 'VIRTUAL HALL 01',
    speaker: 'Dr. Evelyn Vance',
    seatsLeft: 42,
    description: 'Join senior curators for an interactive 3D spatial tour of Auguste Rodin\'s plaster models and bronze foundry techniques.'
  },
  {
    id: 'event-2',
    title: 'DECODING HIEROGLYPHS ON THE ROSETTA STONE',
    date: 'DEC 05, 2026 • 20:00 UTC',
    location: 'VIRTUAL HALL 03',
    speaker: 'Prof. Marcus Thorne',
    seatsLeft: 19,
    description: 'An interactive lecture analyzing Jean-François Champollion\'s 1822 breakthrough decipherment.'
  }
];

export const AI_CURATOR_KNOWLEDGE = [
  {
    keywords: ['thinker', 'rodin', 'gates of hell', 'sculpture'],
    title: 'Auguste Rodin\'s The Thinker',
    answer: 'The Thinker (1904) by Auguste Rodin is a monumental bronze sculpture portraying Dante Alighieri contemplating human existence at the gates of hell.'
  },
  {
    keywords: ['chola', 'nataraja', 'shiva', 'cosmic', 'bronze', 'india'],
    title: 'Chola Dynasty Nataraja Bronze',
    answer: 'The 11th-century Tamil Nadu Chola Nataraja represents Shiva dancing the cosmic cycle of creation and destruction within a ring of flames.'
  },
  {
    keywords: ['mona lisa', 'da vinci', 'louvre', 'sfumato', 'smile'],
    title: 'Leonardo da Vinci\'s Mona Lisa',
    answer: 'Painted between 1503–1519, Mona Lisa is renowned for Leonardo\'s sfumato glaze layering and her enigmatic expression.'
  },
  {
    keywords: ['starry night', 'van gogh', 'moma', 'swirl'],
    title: 'Vincent van Gogh\'s Starry Night',
    answer: 'Painted in 1889 at Saint-Rémy-de-Provence, Starry Night captures turbulent celestial motion with expressive impasto strokes.'
  },
  {
    keywords: ['rosetta', 'hieroglyph', 'egypt', 'stone'],
    title: 'The Rosetta Stone (196 BCE)',
    answer: 'Discovered in 1799, the Rosetta Stone contains the same royal decree in Hieroglyphs, Demotic, and Ancient Greek, unlocking ancient Egyptian history.'
  }
];

