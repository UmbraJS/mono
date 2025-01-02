type Reasoning = 'deductive' | 'inductive' | 'abductive'
type CredibilityLevel = 'homerun' | 'strong' | 'solid' | 'weak' | 'embarrassing'

type ReasoningType = 'Normative' | 'Descriptive'
type MoralValue = 'Obligation' | 'Good' | 'Neutral' | 'Bad' | 'Evil'

// Who - Who does our moral consideration apply to?
type SubjectAxioms =
  | 'Sapientism'
  | 'Sentientism'
  | 'Animalism'
  | 'Plantism'
  | 'Bacteriumism'
  | 'Virusism'
  | 'Fungism'
  | 'Biocentrism'
  | 'Theocentrism'
  | 'Ecocentrism'
  | 'Mineralism'

// Extent - To what extent does our moral consideration apply?
type SubjectExtentAxioms = 'sacred' | 'fair' | 'dont be evil' | 'preserve' | 'who cares' | 'anti'

// Relationship - What is our relationship to our moral consideration?
type RelationalAxioms = 'Egoism' | 'Altruism'

// What - What is the nature of our moral consideration?
type WhatAxiom = 'Happines' | 'Health' | 'Freedom' | 'Knowledge' | 'Power' | 'Wealth' | 'Hedonism'

// How - How does our moral consideration apply?
type HowAxioms =
  | 'Consequentialism'
  | 'Deontology'
  | 'Moral Anti-Realism'
  | 'Moral Functionalism'
  | 'Social Contract Theory'
  | 'Utilitarianism'
  | 'Virtue Ethics'

interface Axiom {
  subject: SubjectAxioms
  extent: SubjectExtentAxioms
  value: WhatAxiom
  application: HowAxioms
  relationship: RelationalAxioms
}

interface Credibility {
  value: number
  level: CredibilityLevel
  votes: {
    level: CredibilityLevel
    value: number
    labels: string[]
    axioms: Axiom[]
    userId: string
  }[]
}

interface Reason {
  id: string
  reasoning: Reasoning
  conclution: string
  premises: Premise[]
  credibility: Credibility
  type: ReasoningType
  moralValue: MoralValue
  background?: {
    url: string
    alt: string
    offset: string
  }
}

interface Premise {
  id: string
  type: string
  text: string
  credibility: Credibility
}

export type { Reason, Premise }
