/**
 * Recommendation Engine - Generates personalized recommendations
 * based on face analysis results
 */

/**
 * Generates all recommendations based on analysis
 * @param {Object} analysis - Face analysis results
 * @returns {Object} Recommendations for skincare, makeup, and outfits
 */
function generateRecommendations(analysis) {
  return {
    skincare: generateSkincareRecommendations(analysis),
    makeup: generateMakeupRecommendations(analysis),
    outfits: generateOutfitRecommendations(analysis)
  };
}

/**
 * Generates skincare recommendations
 */
function generateSkincareRecommendations(analysis) {
  const { skinType, skinTone } = analysis;
  
  const cleanserTypes = {
    dry: 'Gentle Hydrating Cleanser',
    oily: 'Foaming Oil-Control Cleanser',
    combination: 'Balancing Gel Cleanser',
    sensitive: 'Fragrance-Free Gentle Cleanser'
  };
  
  const serumTypes = {
    dry: 'Hyaluronic Acid Serum',
    oily: 'Niacinamide Serum',
    combination: 'Vitamin C Brightening Serum',
    sensitive: 'Calming Ceramide Serum'
  };
  
  const moisturizerTypes = {
    dry: 'Rich Hydrating Cream',
    oily: 'Lightweight Gel Moisturizer',
    combination: 'Balancing Lotion',
    sensitive: 'Hypoallergenic Moisturizer'
  };
  
  return {
    cleanser: {
      type: cleanserTypes[skinType] || cleanserTypes.combination,
      description: `Recommended for ${skinType} skin`,
      url: 'https://example.com/skincare/cleanser'
    },
    serum: {
      type: serumTypes[skinType] || serumTypes.combination,
      description: `Best for ${skinType} skin types`,
      url: 'https://example.com/skincare/serum'
    },
    moisturizer: {
      type: moisturizerTypes[skinType] || moisturizerTypes.combination,
      description: `Perfect match for your ${skinType} skin`,
      url: 'https://example.com/skincare/moisturizer'
    },
    spf: {
      type: 'Broad Spectrum SPF 30+',
      description: `Recommended SPF for ${skinTone} skin tone`,
      url: 'https://example.com/skincare/spf'
    }
  };
}

/**
 * Generates makeup recommendations
 */
function generateMakeupRecommendations(analysis) {
  const { undertone, skinTone } = analysis;
  
  const foundationTypes = {
    warm: {
      light: 'Warm Ivory Foundation - Light Coverage',
      medium: 'Warm Beige Foundation - Medium Coverage',
      tan: 'Warm Tan Foundation - Full Coverage',
      deep: 'Warm Deep Foundation - Full Coverage'
    },
    cool: {
      light: 'Cool Porcelain Foundation - Light Coverage',
      medium: 'Cool Beige Foundation - Medium Coverage',
      tan: 'Cool Tan Foundation - Full Coverage',
      deep: 'Cool Deep Foundation - Full Coverage'
    },
    neutral: {
      light: 'Neutral Ivory Foundation - Light Coverage',
      medium: 'Neutral Beige Foundation - Medium Coverage',
      tan: 'Neutral Tan Foundation - Full Coverage',
      deep: 'Neutral Deep Foundation - Full Coverage'
    }
  };
  
  const blushShades = {
    warm: ['Peach', 'Coral', 'Terracotta'],
    cool: ['Rose', 'Berry', 'Pink'],
    neutral: ['Mauve', 'Dusty Rose', 'Nude Pink']
  };
  
  const lipstickShades = {
    warm: ['Coral', 'Orange-Red', 'Terracotta', 'Warm Nude'],
    cool: ['Berry', 'Pink', 'Cool Red', 'Mauve'],
    neutral: ['Rose', 'Nude', 'MLBB (My Lips But Better)', 'Mauve']
  };
  
  const eyeMakeupStyles = {
    warm: 'Warm Earth Tones - Golds, Browns, Copper',
    cool: 'Cool Tones - Purples, Silvers, Cool Browns',
    neutral: 'Versatile Palette - Mix of Warm and Cool'
  };
  
  return {
    foundation: {
      type: foundationTypes[undertone]?.[skinTone] || foundationTypes.neutral.medium,
      description: `Perfect foundation match for ${undertone} undertone and ${skinTone} skin`,
      url: 'https://example.com/makeup/foundation'
    },
    blush: {
      shades: blushShades[undertone] || blushShades.neutral,
      description: `Recommended blush shades for ${undertone} undertone`,
      url: 'https://example.com/makeup/blush'
    },
    lipstick: {
      shades: lipstickShades[undertone] || lipstickShades.neutral,
      description: `Perfect lipstick shades for your ${undertone} undertone`,
      url: 'https://example.com/makeup/lipstick'
    },
    eyeMakeup: {
      style: eyeMakeupStyles[undertone] || eyeMakeupStyles.neutral,
      description: `Eye makeup style that complements your ${undertone} undertone`,
      url: 'https://example.com/makeup/eye'
    }
  };
}

/**
 * Generates outfit recommendations
 */
function generateOutfitRecommendations(analysis) {
  const { skinTone, undertone } = analysis;
  
  const outfitColors = {
    warm: {
      light: ['Cream', 'Camel', 'Olive Green', 'Rust'],
      medium: ['Terracotta', 'Mustard', 'Warm Brown', 'Coral'],
      tan: ['Deep Orange', 'Burgundy', 'Warm Red', 'Gold'],
      deep: ['Rich Burgundy', 'Deep Gold', 'Warm Purple', 'Burnt Orange']
    },
    cool: {
      light: ['Soft Pink', 'Lavender', 'Navy', 'Cool Gray'],
      medium: ['Royal Blue', 'Emerald Green', 'Cool Red', 'Plum'],
      tan: ['Deep Blue', 'Forest Green', 'Berry', 'Cool Purple'],
      deep: ['Navy', 'Deep Purple', 'Cool Burgundy', 'Silver']
    },
    neutral: {
      light: ['Navy', 'Gray', 'Burgundy', 'Olive'],
      medium: ['Teal', 'Mauve', 'Navy', 'Forest Green'],
      tan: ['Deep Teal', 'Burgundy', 'Navy', 'Plum'],
      deep: ['Navy', 'Deep Teal', 'Burgundy', 'Charcoal']
    }
  };
  
  const colors = outfitColors[undertone]?.[skinTone] || outfitColors.neutral.medium;
  
  return {
    outfit1: {
      description: `Casual Chic: ${colors[0]} top with neutral bottoms`,
      colors: [colors[0], 'Neutral'],
      url: 'https://example.com/outfits/casual',
      style: 'Casual Day Outfit'
    },
    outfit2: {
      description: `Elegant Evening: ${colors[1]} dress with ${colors[2]} accessories`,
      colors: [colors[1], colors[2]],
      url: 'https://example.com/outfits/evening',
      style: 'Evening Outfit'
    }
  };
}

module.exports = {
  generateRecommendations,
  generateSkincareRecommendations,
  generateMakeupRecommendations,
  generateOutfitRecommendations
};

