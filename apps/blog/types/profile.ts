
export interface IdentityTagBase {
  id: string
  fervor: "low" | "medium" | "high"
}

export interface IdentityTagReligion extends IdentityTagBase {
  subject: 'religion'
  name: "christian" | "muslim" | "jewish" | "hindu" | "buddhist" | "atheist"
}

export interface IdentityTagPolitics extends IdentityTagBase {
  subject: 'politics'
  name: "liberal" | "conservative" | "libertarian" | "socialist" | "communist"
}

type Origins =
  | "norwegian"
  | "swedish"
  | "danish"
  | "finnish"
  | "icelandic"
  | "german"
  | "french"
  | "italian"
  | "spanish"
  | "portuguese"
  | "british"
  | "irish"
  | "dutch"
  | "belgian"

export interface IdentityTagEthnicity extends IdentityTagBase {
  subject: 'ethnicity'
  name: Origins
}

export interface IdentityTagHeritage extends IdentityTagBase {
  subject: 'heritage'
  name: Origins
}

export interface IdentityTagNativity extends IdentityTagBase {
  subject: 'nativity'
  name: Origins
}

export interface IdentityTagNationality extends IdentityTagBase {
  subject: 'nationality'
  name: Origins
}

interface IdentityTagNationalStatus extends IdentityTagBase {
  subject: "national-status"
  name: "citizen" | "immigrant" | "refugee"
}

export interface IndentityTagOccupation extends IdentityTagBase {
  subject: 'occupation'
  name: "engineer" | "artist" | "teacher" | "doctor" | "lawyer" | "scientist" | "writer" | "musician" | "athlete" | "chef"
}

export interface IndentityTagHobby extends IdentityTagBase {
  subject: 'hobby'
  name: "gamer" | "reader" | "traveler" | "artist" | "athlete"
}

export interface IndentityTagEducation extends IdentityTagBase {
  subject: 'education'
  name: "BA" | "MA" | "PhD"
}

export interface IndentityTagRelationship extends IdentityTagBase {
  subject: 'relationship'
  name: "single" | "relationship" | "married" | "divorced"
}

export interface IdentityTagFamily extends IdentityTagBase {
  subject: "family"
  name: "breadwinner" | "homemaker" | "dependent" | "parent"
}

export interface IdentityTagGender extends IdentityTagBase {
  subject: "gender"
  name: "boy" | "girl" | "non-binary"
}

export interface IdentityTagAge extends IdentityTagBase {
  subject: "age"
  name: "kid" | "teen" | "young adult" | "adult" | "elder"
}

export type IdentityTag = (IdentityTagReligion | IdentityTagPolitics | IdentityTagNationality | IndentityTagOccupation | IndentityTagHobby | IndentityTagEducation | IndentityTagRelationship | IdentityTagFamily | IdentityTagEthnicity | IdentityTagHeritage | IdentityTagNativity | IdentityTagNationality | IdentityTagGender | IdentityTagAge | IdentityTagNationalStatus)

interface AuthorIdentity {
  id: string
  name: string
  avatarUrl: string
  indentityTags: IdentityTag[]
}

export const author: AuthorIdentity = {
  id: 'author-123',
  name: 'John Doe',
  avatarUrl: 'https://images.unsplash.com/flagged/photo-1595514191830-3e96a518989b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  indentityTags: [
    {
      id: "tag-0",
      subject: "age",
      name: "adult",
      fervor: "medium"
    },
    {
      id: "tag-4",
      subject: "gender",
      name: "boy",
      fervor: "medium"
    },
    // {
    //   id: "tag-1",
    //   subject: "politics",
    //   name: "liberal",
    //   fervor: "high"
    // },
    // {
    //   id: "tag-2",
    //   subject: "nationality",
    //   name: "norwegian",
    //   fervor: "high"
    // },
    // {
    //   id: "tag-3",
    //   subject: "religion",
    //   name: "atheist",
    //   fervor: "low"
    // }
  ]
}
