interface Name {
  title: string
  first: string
  last: string
}

interface Location {
  street: {
    number: number
    name: string
  }
  city: string
  state: string
  country: string
  postcode: string
  coordinates: {
    latitude: string
    longitude: string
  }
  timezone: {
    offset: string
    description: string
  }
}

interface Login {
  uuid: string
  username: string
  password: string
  salt: string
  md5: string
  sha1: string
  sha256: string
}

interface DateInfo {
  date: string
  age: number
}

interface Indentification {
  name: string
  value: string
}

interface Picture {
  large: string
  medium: string
  thumbnail: string
}

interface RandomUser {
  gender: string
  name: Name
  location: Location
  email: string
  login: Login
  dob: DateInfo
  registered: DateInfo
  phone: string
  cell: string
  id: Indentification
  picture: Picture
  nat: string
}

interface RandomUsers {
  results: RandomUser[]
  info: {
    seed: string
    results: number
    page: number
    version: string
  }
}

export default defineEventHandler(async () => {
  const randomusers = await $fetch<RandomUsers>('https://randomuser.me/api/?results=4')
  console.log('rex 22', randomusers.results)

  return [
    {
      id: '155',
      title: 'H-1B visas need to be massively reduced in quantity. It’s used to suppress wages.',
      author: randomusers.results[0],
    },
    {
      id: '156',
      title: 'In what way?',
      author: randomusers.results[1],
    },
    {
      id: '157',
      title: 'Supply and demand',
      author: randomusers.results[2],
    },
    {
      id: '158',
      title: 'More people will increase both demand and supply - not just one',
      author: randomusers.results[3],
    },
    {
      id: '159',
      title: 'wow u dont understand the economics of employment AT ALL',
      author: randomusers.results[2],
    },
    {
      id: '160',
      title:
        "Here, just open up this page and start reading. And don't come back until you are ready to admit that you're the one that didn't understand how the economics of unemployment works",
      citation:
        'https://www.stlouisfed.org/publications/page-one-economics/2020/11/02/examining-the-lump-of-labor-fallacy-using-a-simple-economic-model',
      author: randomusers.results[3],
    },
    {
      id: '161',
      title:
        "oh yeah because that argument for fallacy trumps the real world data, why can't these guys stay home and create jobs in their own country then, u buy whatever propaganda mega corporations sell to u.. sad",
      author: randomusers.results[2],
    },
    {
      id: '162',
      title:
        "What real world data? They explicitly go over and talk about the real world data in that exact article you illiterate moron. Unemployment is below 5%. You don't have an unemployment problem in America so what contradictory data are you talking about?",
      author: randomusers.results[3],
    },
    {
      id: '163',
      title:
        "if u think unemployment is actually below 5% u don't understand what data itself even is, there is no point in talking to someone so brainwashed",
      author: randomusers.results[2],
    },
    {
      id: '164',
      title:
        'Oh man. One google search could have saved you the embarrassment. This data is very well known to anyone who has ever studied economics - so I am going to go on a limb here and assume that you where talking out your ass when you pretended to have some greater knowledge about this',
      author: randomusers.results[3],
    },
  ]
})
