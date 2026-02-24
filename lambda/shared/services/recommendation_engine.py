"""
Recommendation Engine - Generates personalized recommendations
based on face analysis results
"""

from typing import Dict, Any, List


def generate_recommendations(analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Generate all recommendations based on analysis"""
    return {
        'skincare': generate_skincare_recommendations(analysis),
        'makeup': generate_makeup_recommendations(analysis),
        'outfits': generate_outfit_recommendations(analysis)
    }


def generate_skincare_recommendations(analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Generate skincare recommendations"""
    skin_type = analysis.get('skinType', 'combination')
    skin_tone = analysis.get('skinTone', 'medium')
    
    cleanser_types = {
        'dry': 'Gentle Hydrating Cleanser',
        'oily': 'Foaming Oil-Control Cleanser',
        'combination': 'Balancing Gel Cleanser',
        'sensitive': 'Fragrance-Free Gentle Cleanser'
    }
    
    serum_types = {
        'dry': 'Hyaluronic Acid Serum',
        'oily': 'Niacinamide Serum',
        'combination': 'Vitamin C Brightening Serum',
        'sensitive': 'Calming Ceramide Serum'
    }
    
    moisturizer_types = {
        'dry': 'Rich Hydrating Cream',
        'oily': 'Lightweight Gel Moisturizer',
        'combination': 'Balancing Lotion',
        'sensitive': 'Hypoallergenic Moisturizer'
    }
    
    return {
        'cleanser': {
            'type': cleanser_types.get(skin_type, cleanser_types['combination']),
            'description': f'Recommended for {skin_type} skin',
            'url': 'https://example.com/skincare/cleanser'
        },
        'serum': {
            'type': serum_types.get(skin_type, serum_types['combination']),
            'description': f'Best for {skin_type} skin types',
            'url': 'https://example.com/skincare/serum'
        },
        'moisturizer': {
            'type': moisturizer_types.get(skin_type, moisturizer_types['combination']),
            'description': f'Perfect match for your {skin_type} skin',
            'url': 'https://example.com/skincare/moisturizer'
        },
        'spf': {
            'type': 'Broad Spectrum SPF 30+',
            'description': f'Recommended SPF for {skin_tone} skin tone',
            'url': 'https://example.com/skincare/spf'
        }
    }


def generate_makeup_recommendations(analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Generate makeup recommendations"""
    undertone = analysis.get('undertone', 'neutral')
    skin_tone = analysis.get('skinTone', 'medium')
    
    foundation_types = {
        'warm': {
            'light': 'Warm Ivory Foundation - Light Coverage',
            'medium': 'Warm Beige Foundation - Medium Coverage',
            'tan': 'Warm Tan Foundation - Full Coverage',
            'deep': 'Warm Deep Foundation - Full Coverage'
        },
        'cool': {
            'light': 'Cool Porcelain Foundation - Light Coverage',
            'medium': 'Cool Beige Foundation - Medium Coverage',
            'tan': 'Cool Tan Foundation - Full Coverage',
            'deep': 'Cool Deep Foundation - Full Coverage'
        },
        'neutral': {
            'light': 'Neutral Ivory Foundation - Light Coverage',
            'medium': 'Neutral Beige Foundation - Medium Coverage',
            'tan': 'Neutral Tan Foundation - Full Coverage',
            'deep': 'Neutral Deep Foundation - Full Coverage'
        }
    }
    
    blush_shades = {
        'warm': ['Peach', 'Coral', 'Terracotta'],
        'cool': ['Rose', 'Berry', 'Pink'],
        'neutral': ['Mauve', 'Dusty Rose', 'Nude Pink']
    }
    
    lipstick_shades = {
        'warm': ['Coral', 'Orange-Red', 'Terracotta', 'Warm Nude'],
        'cool': ['Berry', 'Pink', 'Cool Red', 'Mauve'],
        'neutral': ['Rose', 'Nude', 'MLBB (My Lips But Better)', 'Mauve']
    }
    
    eye_makeup_styles = {
        'warm': 'Warm Earth Tones - Golds, Browns, Copper',
        'cool': 'Cool Tones - Purples, Silvers, Cool Browns',
        'neutral': 'Versatile Palette - Mix of Warm and Cool'
    }
    
    foundation_map = foundation_types.get(undertone, foundation_types['neutral'])
    
    return {
        'foundation': {
            'type': foundation_map.get(skin_tone, foundation_map['medium']),
            'description': f'Perfect foundation match for {undertone} undertone and {skin_tone} skin',
            'url': 'https://example.com/makeup/foundation'
        },
        'blush': {
            'shades': blush_shades.get(undertone, blush_shades['neutral']),
            'description': f'Recommended blush shades for {undertone} undertone',
            'url': 'https://example.com/makeup/blush'
        },
        'lipstick': {
            'shades': lipstick_shades.get(undertone, lipstick_shades['neutral']),
            'description': f'Perfect lipstick shades for your {undertone} undertone',
            'url': 'https://example.com/makeup/lipstick'
        },
        'eyeMakeup': {
            'style': eye_makeup_styles.get(undertone, eye_makeup_styles['neutral']),
            'description': f'Eye makeup style that complements your {undertone} undertone',
            'url': 'https://example.com/makeup/eye'
        }
    }


def generate_outfit_recommendations(analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Generate outfit recommendations"""
    skin_tone = analysis.get('skinTone', 'medium')
    undertone = analysis.get('undertone', 'neutral')
    
    outfit_colors = {
        'warm': {
            'light': ['Cream', 'Camel', 'Olive Green', 'Rust'],
            'medium': ['Terracotta', 'Mustard', 'Warm Brown', 'Coral'],
            'tan': ['Deep Orange', 'Burgundy', 'Warm Red', 'Gold'],
            'deep': ['Rich Burgundy', 'Deep Gold', 'Warm Purple', 'Burnt Orange']
        },
        'cool': {
            'light': ['Soft Pink', 'Lavender', 'Navy', 'Cool Gray'],
            'medium': ['Royal Blue', 'Emerald Green', 'Cool Red', 'Plum'],
            'tan': ['Deep Blue', 'Forest Green', 'Berry', 'Cool Purple'],
            'deep': ['Navy', 'Deep Purple', 'Cool Burgundy', 'Silver']
        },
        'neutral': {
            'light': ['Navy', 'Gray', 'Burgundy', 'Olive'],
            'medium': ['Teal', 'Mauve', 'Navy', 'Forest Green'],
            'tan': ['Deep Teal', 'Burgundy', 'Navy', 'Plum'],
            'deep': ['Navy', 'Deep Teal', 'Burgundy', 'Charcoal']
        }
    }
    
    colors_map = outfit_colors.get(undertone, outfit_colors['neutral'])
    colors = colors_map.get(skin_tone, colors_map['medium'])
    
    return {
        'outfit1': {
            'description': f'Casual Chic: {colors[0]} top with neutral bottoms',
            'colors': [colors[0], 'Neutral'],
            'url': 'https://example.com/outfits/casual',
            'style': 'Casual Day Outfit'
        },
        'outfit2': {
            'description': f'Elegant Evening: {colors[1]} dress with {colors[2]} accessories',
            'colors': [colors[1], colors[2]],
            'url': 'https://example.com/outfits/evening',
            'style': 'Evening Outfit'
        }
    }




