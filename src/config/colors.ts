/**
 * Centralized Color Palette Configuration
 * Use these color variables throughout the application for consistency
 */

export const colors = {
  // Primary Blue Palette
  primary: {
    darkest: '#0F2854',   // Emergency, Critical, Dark accents
    dark: '#1C4D8D',      // Medium blue, Secondary elements
    main: '#4988C4',      // Light blue, Primary interactive elements
    light: '#BDE8F5',     // Pale blue, Backgrounds, Hover states
  },
  
  // Semantic Colors
  emergency: '#0F2854',   // Emergency/Critical cases
  doctor: '#4988C4',      // Doctor visit required
  selfCare: '#4CAF50',    // Self-care cases (green - only exception)
  
  // Status Colors
  active: '#4CAF50',      // Active status
  pending: '#4988C4',     // Pending status
  inactive: '#0F2854',    // Inactive status
  
  // Gradients
  gradients: {
    primary: 'from-[#4988C4] via-[#1C4D8D] to-[#0F2854]',
    secondary: 'from-[#1C4D8D] to-[#4988C4]',
    light: 'from-[#BDE8F5] to-[#4988C4]',
    reverse: 'from-[#0F2854] to-[#4988C4]',
    soft: 'from-[#BDE8F5] via-[#4988C4] to-[#1C4D8D]',
  },
  
  // Background Patterns
  backgrounds: {
    primary: 'bg-[#4988C4]/5',
    secondary: 'bg-[#1C4D8D]/5',
    light: 'bg-[#BDE8F5]/5',
  },
} as const;

// Export individual colors for convenience
export const {
  primary,
  emergency,
  doctor,
  selfCare,
  active,
  pending,
  inactive,
  gradients,
  backgrounds,
} = colors;

export default colors;
