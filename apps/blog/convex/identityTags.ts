/**
 * Identity Tags - Single Source of Truth
 * 
 * This file is the canonical source for all identity tag definitions and types.
 * 
 * - Runtime data (ALL_TAGS) defines available tags
 * - TypeScript types are inferred from this runtime data
 * - Frontend imports types from this file (via types/profile.ts re-exports)
 * - No manual type/data synchronization needed
 * 
 * To add a new tag:
 * 1. Add it to ALL_TAGS array below
 * 2. Types automatically update (TagsBySubject inference)
 * 3. Queries immediately expose it to frontend
 * 
 * Tags have prerequisites that must be met before a user can claim them.
 * The backend validates these prerequisites when a tag is requested.
 */

import { query } from "./_generated/server"

export const FERVOR_LEVELS = ['low', 'medium', 'high'] as const
export type Fervor = typeof FERVOR_LEVELS[number]

// Subjects matching your types
export const IDENTITY_SUBJECTS = [
  'religion',
  'politics',
  'ethnicity',
  'heritage',
  'nativity',
  'nationality',
  'national-status',
  'occupation',
  'hobby',
  'education',
  'relationship',
  'family',
  'gender',
  'age',
] as const

export type IdentitySubject = typeof IDENTITY_SUBJECTS[number]

export interface IdentityTagDefinition {
  id: string
  subject: IdentitySubject
  name: string
  displayName: string
  // Prerequisites for claiming this tag (to be implemented)
  requiresChallenge?: boolean
  requiresFollowers?: number
}

// Runtime identity tag structure (what gets stored on personas)
export interface IdentityTag {
  id: string
  subject: IdentitySubject
  name: string
  fervor: Fervor
}

// Origins used by ethnicity, heritage, nativity, nationality
const ORIGINS = [
  "norwegian", "swedish", "danish", "finnish", "icelandic",
  "german", "french", "italian", "spanish", "portuguese",
  "british", "irish", "dutch", "belgian"
] as const

// Helper to generate tag definitions for origin-based subjects
function generateOriginTags(subject: 'ethnicity' | 'heritage' | 'nativity' | 'nationality'): IdentityTagDefinition[] {
  return ORIGINS.map(origin => ({
    id: `${subject}-${origin}`,
    subject,
    name: origin,
    displayName: origin.charAt(0).toUpperCase() + origin.slice(1),
  }))
}

// All available identity tags
const ALL_TAGS: IdentityTagDefinition[] = [
  // Religion
  { id: 'religion-christian', subject: 'religion', name: 'christian', displayName: 'Christian' },
  { id: 'religion-muslim', subject: 'religion', name: 'muslim', displayName: 'Muslim' },
  { id: 'religion-jewish', subject: 'religion', name: 'jewish', displayName: 'Jewish' },
  { id: 'religion-hindu', subject: 'religion', name: 'hindu', displayName: 'Hindu' },
  { id: 'religion-buddhist', subject: 'religion', name: 'buddhist', displayName: 'Buddhist' },
  { id: 'religion-atheist', subject: 'religion', name: 'atheist', displayName: 'Atheist' },

  // Politics
  { id: 'politics-liberal', subject: 'politics', name: 'liberal', displayName: 'Liberal' },
  { id: 'politics-conservative', subject: 'politics', name: 'conservative', displayName: 'Conservative' },
  { id: 'politics-libertarian', subject: 'politics', name: 'libertarian', displayName: 'Libertarian' },
  { id: 'politics-socialist', subject: 'politics', name: 'socialist', displayName: 'Socialist' },
  { id: 'politics-communist', subject: 'politics', name: 'communist', displayName: 'Communist' },

  // National Status
  { id: 'national-status-citizen', subject: 'national-status', name: 'citizen', displayName: 'Citizen' },
  { id: 'national-status-immigrant', subject: 'national-status', name: 'immigrant', displayName: 'Immigrant' },
  { id: 'national-status-refugee', subject: 'national-status', name: 'refugee', displayName: 'Refugee' },

  // Occupation
  { id: 'occupation-engineer', subject: 'occupation', name: 'engineer', displayName: 'Engineer' },
  { id: 'occupation-artist', subject: 'occupation', name: 'artist', displayName: 'Artist' },
  { id: 'occupation-teacher', subject: 'occupation', name: 'teacher', displayName: 'Teacher' },
  { id: 'occupation-doctor', subject: 'occupation', name: 'doctor', displayName: 'Doctor' },
  { id: 'occupation-lawyer', subject: 'occupation', name: 'lawyer', displayName: 'Lawyer' },
  { id: 'occupation-scientist', subject: 'occupation', name: 'scientist', displayName: 'Scientist' },
  { id: 'occupation-writer', subject: 'occupation', name: 'writer', displayName: 'Writer' },
  { id: 'occupation-musician', subject: 'occupation', name: 'musician', displayName: 'Musician' },
  { id: 'occupation-athlete', subject: 'occupation', name: 'athlete', displayName: 'Athlete' },
  { id: 'occupation-chef', subject: 'occupation', name: 'chef', displayName: 'Chef' },

  // Hobby
  { id: 'hobby-gamer', subject: 'hobby', name: 'gamer', displayName: 'Gamer' },
  { id: 'hobby-reader', subject: 'hobby', name: 'reader', displayName: 'Reader' },
  { id: 'hobby-traveler', subject: 'hobby', name: 'traveler', displayName: 'Traveler' },
  { id: 'hobby-artist', subject: 'hobby', name: 'artist', displayName: 'Artist' },
  { id: 'hobby-athlete', subject: 'hobby', name: 'athlete', displayName: 'Athlete' },

  // Education
  { id: 'education-ba', subject: 'education', name: 'BA', displayName: 'Bachelor\'s Degree' },
  { id: 'education-ma', subject: 'education', name: 'MA', displayName: 'Master\'s Degree' },
  { id: 'education-phd', subject: 'education', name: 'PhD', displayName: 'Doctorate' },

  // Relationship
  { id: 'relationship-single', subject: 'relationship', name: 'single', displayName: 'Single' },
  { id: 'relationship-relationship', subject: 'relationship', name: 'relationship', displayName: 'In a Relationship' },
  { id: 'relationship-married', subject: 'relationship', name: 'married', displayName: 'Married' },
  { id: 'relationship-divorced', subject: 'relationship', name: 'divorced', displayName: 'Divorced' },

  // Family
  { id: 'family-breadwinner', subject: 'family', name: 'breadwinner', displayName: 'Breadwinner' },
  { id: 'family-homemaker', subject: 'family', name: 'homemaker', displayName: 'Homemaker' },
  { id: 'family-dependent', subject: 'family', name: 'dependent', displayName: 'Dependent' },
  { id: 'family-parent', subject: 'family', name: 'parent', displayName: 'Parent' },

  // Gender
  { id: 'gender-boy', subject: 'gender', name: 'boy', displayName: 'Boy' },
  { id: 'gender-girl', subject: 'gender', name: 'girl', displayName: 'Girl' },
  { id: 'gender-non-binary', subject: 'gender', name: 'non-binary', displayName: 'Non-binary' },

  // Age
  { id: 'age-kid', subject: 'age', name: 'kid', displayName: 'Kid' },
  { id: 'age-teen', subject: 'age', name: 'teen', displayName: 'Teen' },
  { id: 'age-young-adult', subject: 'age', name: 'young adult', displayName: 'Young Adult' },
  { id: 'age-adult', subject: 'age', name: 'adult', displayName: 'Adult' },
  { id: 'age-elder', subject: 'age', name: 'elder', displayName: 'Elder' },

  // Origin-based tags (ethnicity, heritage, nativity, nationality)
  ...generateOriginTags('ethnicity'),
  ...generateOriginTags('heritage'),
  ...generateOriginTags('nativity'),
  ...generateOriginTags('nationality'),
]

// Create lookup map for fast access
const IDENTITY_TAG_MAP = new Map(ALL_TAGS.map(tag => [tag.id, tag]))

/**
 * Get a tag definition by ID
 */
export function getTagDefinition(tagId: string): IdentityTagDefinition | undefined {
  return IDENTITY_TAG_MAP.get(tagId)
}

/**
 * Get all available tag definitions
 */
export function getAllTagDefinitions(): IdentityTagDefinition[] {
  return ALL_TAGS
}

/**
 * Query to get all available identity tags
 */
export const listAllTags = query({
  args: {},
  handler: async () => {
    return getAllTagDefinitions()
  },
})

/**
 * Query to get tags filtered by subject
 */
export const listTagsBySubject = query({
  args: {},
  handler: async () => {
    // Group tags by subject for easier UI consumption
    const grouped: Record<string, IdentityTagDefinition[]> = {}

    for (const tag of ALL_TAGS) {
      if (!grouped[tag.subject]) {
        grouped[tag.subject] = []
      }
      grouped[tag.subject].push(tag)
    }

    return grouped
  },
})

/**
 * Check if a user/persona can claim a specific tag
 * This is where prerequisite validation happens
 */
export async function canClaimTag(
  tagId: string,
  _userId?: string,
  _personaId?: string,
  _followerCount?: number,
): Promise<{ allowed: boolean; reason?: string }> {
  const tagDef = getTagDefinition(tagId)

  if (!tagDef) {
    return { allowed: false, reason: 'Tag does not exist' }
  }

  // TODO: Implement prerequisite checks
  // if (tagDef.requiresFollowers && _followerCount < tagDef.requiresFollowers) {
  //   return { allowed: false, reason: `Requires ${tagDef.requiresFollowers} followers` }
  // }

  // if (tagDef.requiresChallenge) {
  //   // Check if challenge has been completed
  // }

  return { allowed: true }
}

// ============================================================================
// Type inference helpers - derive TypeScript types from runtime data
// ============================================================================

// Extract all unique tag names by subject
type TagsBySubject<S extends IdentitySubject> = Extract<typeof ALL_TAGS[number], { subject: S }>['name']

// Subject-specific tag types with fervor
export type IdentityTagReligion = { subject: 'religion'; name: TagsBySubject<'religion'>; fervor: Fervor; id: string }
export type IdentityTagPolitics = { subject: 'politics'; name: TagsBySubject<'politics'>; fervor: Fervor; id: string }
export type IdentityTagEthnicity = { subject: 'ethnicity'; name: TagsBySubject<'ethnicity'>; fervor: Fervor; id: string }
export type IdentityTagHeritage = { subject: 'heritage'; name: TagsBySubject<'heritage'>; fervor: Fervor; id: string }
export type IdentityTagNativity = { subject: 'nativity'; name: TagsBySubject<'nativity'>; fervor: Fervor; id: string }
export type IdentityTagNationality = { subject: 'nationality'; name: TagsBySubject<'nationality'>; fervor: Fervor; id: string }
export type IdentityTagNationalStatus = { subject: 'national-status'; name: TagsBySubject<'national-status'>; fervor: Fervor; id: string }
export type IdentityTagOccupation = { subject: 'occupation'; name: TagsBySubject<'occupation'>; fervor: Fervor; id: string }
export type IdentityTagHobby = { subject: 'hobby'; name: TagsBySubject<'hobby'>; fervor: Fervor; id: string }
export type IdentityTagEducation = { subject: 'education'; name: TagsBySubject<'education'>; fervor: Fervor; id: string }
export type IdentityTagRelationship = { subject: 'relationship'; name: TagsBySubject<'relationship'>; fervor: Fervor; id: string }
export type IdentityTagFamily = { subject: 'family'; name: TagsBySubject<'family'>; fervor: Fervor; id: string }
export type IdentityTagGender = { subject: 'gender'; name: TagsBySubject<'gender'>; fervor: Fervor; id: string }
export type IdentityTagAge = { subject: 'age'; name: TagsBySubject<'age'>; fervor: Fervor; id: string }

// Union type for discriminated union pattern
export type IdentityTagTyped =
  | IdentityTagReligion
  | IdentityTagPolitics
  | IdentityTagEthnicity
  | IdentityTagHeritage
  | IdentityTagNativity
  | IdentityTagNationality
  | IdentityTagNationalStatus
  | IdentityTagOccupation
  | IdentityTagHobby
  | IdentityTagEducation
  | IdentityTagRelationship
  | IdentityTagFamily
  | IdentityTagGender
  | IdentityTagAge
