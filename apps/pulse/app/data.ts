import type { Reason } from '../types/reasoning'

const user = {
  id: '1',
  name: 'John Doe',
  email: '',
  avatar:
    'https://media.istockphoto.com/id/959577452/photo/ancient-marble-statue-of-the-great-greek-philosopher-socrates-on-background-the-blue-sky.jpg?s=2048x2048&w=is&k=20&c=WtJU-qeeItsS3qctpWc8mbZpGXRooouQXsrCW5RN5qA=',
  bookmarks: [{ id: '1', type: 'reason' }],
}

const reasons: Reason[] = [
  {
    id: '1',
    reasoning: 'deductive',
    conclution: 'Socrates is mortal',
    moralValue: 'Neutral',
    type: 'Descriptive',
    background: {
      url: 'https://media.istockphoto.com/id/959577452/photo/ancient-marble-statue-of-the-great-greek-philosopher-socrates-on-background-the-blue-sky.jpg?s=2048x2048&w=is&k=20&c=WtJU-qeeItsS3qctpWc8mbZpGXRooouQXsrCW5RN5qA=',
      alt: 'Statue of Socrates',
      offset: '0px -85px;',
    },
    credibility: {
      value: 0.8,
      level: 'solid',
      votes: [],
    },
    premises: [
      {
        id: '1',
        type: 'infavor',
        text: 'All men are mortal',
        credibility: {
          value: 0.8,
          level: 'solid',
          votes: [],
        },
      },
      {
        id: '2',
        type: 'infavor',
        text: 'Socrates is a man',
        credibility: {
          value: 0.8,
          level: 'solid',
          votes: [],
        },
      },
    ],
  },
  {
    id: '2',
    reasoning: 'deductive',
    conclution: 'Democrazy is good',
    moralValue: 'Neutral',
    type: 'Descriptive',
    background: {
      url: 'https://images.unsplash.com/photo-1731331131233-4f73c93ae693?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Libery statue',
      offset: 'center;',
    },
    credibility: {
      value: 0.8,
      level: 'solid',
      votes: [],
    },
    premises: [
      {
        id: '1',
        type: 'infavor',
        text: 'Nuxt layers are a powerful feature that you can use to share and reuse partial Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.',
        source: 'https://github.com/equinor/petec-well-experience/pull/1610',
        credibility: {
          value: 0.8,
          level: 'solid',
          votes: [],
        },
      },
      {
        id: '2',
        type: 'inopposition',
        text: 'Nuxt applications within a monorepo, or from a git repository or npm package. Nuxt applications within a monorepo, or from a git repository or npm package',
        credibility: {
          value: 0.8,
          level: 'solid',
          votes: [],
        },
      },
      {
        id: '3',
        type: 'infavor',
        text: 'Nuxt layers are a powerful feature that you can use to share and reuse partial Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.',
        source: 'https://github.com/equinor/petec-well-experience/pull/1610',
        credibility: {
          value: 0.8,
          level: 'solid',
          votes: [],
        },
      },
    ],
  },
  {
    id: '3',
    reasoning: 'inductive',
    conclution: 'Democrazy is good',
    moralValue: 'Neutral',
    type: 'Descriptive',
    background: undefined,
    credibility: {
      value: 0.8,
      level: 'solid',
      votes: [],
    },
    premises: [
      {
        id: '1',
        type: 'infavor',
        text: 'Lots of mortal men',
        credibility: {
          value: 0.8,
          level: 'solid',
          votes: [],
        },
      },
      {
        id: '2',
        type: 'inopposition',
        text: 'Budda',
        source: 'Plato',
        credibility: {
          value: 0.8,
          level: 'weak',
          votes: [],
        },
      },
    ],
  },
  {
    id: '4',
    reasoning: 'inductive',
    conclution: 'Democrazy is good',
    moralValue: 'Neutral',
    type: 'Descriptive',
    background: undefined,
    credibility: {
      value: 0.8,
      level: 'solid',
      votes: [],
    },
    premises: [],
  },
]

export default {
  user,
  reasons,
}
