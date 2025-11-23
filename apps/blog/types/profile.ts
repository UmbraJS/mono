/**
 * Identity tag types
 *
 * These types are inferred from the runtime tag definitions in convex/identityTags.ts
 * That file is the single source of truth for all available identity tags.
 */

// Re-export everything from the canonical source
// Import for local use
import type { IdentityTag } from '../convex/identityTags'

export type {
  Fervor,
  IdentitySubject,
  IdentityTag,
  IdentityTagDefinition,
  IdentityTagReligion,
  IdentityTagPolitics,
  IdentityTagEthnicity,
  IdentityTagHeritage,
  IdentityTagNativity,
  IdentityTagNationality,
  IdentityTagNationalStatus,
  IdentityTagOccupation,
  IdentityTagHobby,
  IdentityTagEducation,
  IdentityTagRelationship,
  IdentityTagFamily,
  IdentityTagGender,
  IdentityTagAge,
  IdentityTagTyped,
} from '../convex/identityTags'

export { FERVOR_LEVELS, IDENTITY_SUBJECTS } from '../convex/identityTags'

// Example persona data for development
interface AuthorIdentity {
  id: string
  name: string
  avatarUrl: string
  identityTags: IdentityTag[]
}

export const author: AuthorIdentity = {
  id: 'author-123',
  name: 'John Doe222',
  avatarUrl: 'https://images.unsplash.com/flagged/photo-1595514191830-3e96a518989b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  identityTags: [
    {
      id: "age-adult",
      subject: "age",
      name: "adult",
      fervor: "medium"
    },
    {
      id: "gender-boy",
      subject: "gender",
      name: "boy",
      fervor: "medium"
    },
  ]
}
