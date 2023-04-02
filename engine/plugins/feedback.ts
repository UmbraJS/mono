
interface Log {
  type: 'info' | 'error' | 'warn' | 'debug'
  source: string
  message: string
}

const logs: Log[] = [
  { type: 'info', source: 'lol', message: 'Feedback plugin loaded'}
]

// const performance = [
//   { type: 'info', id: "idfn3w", source: 'lol', message: 'Feedback plugin loaded'}
// ]

export const feedback = {
  logs,
  //performance
}

// //logs.push = function() { Array.prototype.push.apply(this, arguments);  processQ();};
// logs.push = function() { 

// };