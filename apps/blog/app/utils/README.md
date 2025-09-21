# Blog App Utils

This directory contains utility functions that can be used throughout the blog app.

## Crypto Utils (`crypto.ts`)

### `getShortId(input, length?)`
Generates a short, deterministic ID from a longer input string using SHA-256 hashing and base62 encoding.

**Parameters:**
- `input: string` - The input string to hash
- `length?: number` - The desired length of the output (default: 8)

**Returns:** `Promise<string>` - A short ID string

**Example:**
```ts
import { getShortId } from '~/utils';

const shortId = await getShortId('user-uuid-123456789', 8);
console.log(shortId); // "aB3xY9Zk"
```

### `getShortIdSync(input, length?)`
Synchronous version using a simpler hash algorithm (fallback for when crypto.subtle is not available).

**Parameters:**
- `input: string` - The input string to hash  
- `length?: number` - The desired length of the output (default: 8)

**Returns:** `string` - A short ID string

**Example:**
```ts
import { getShortIdSync } from '~/utils';

const shortId = getShortIdSync('user-uuid-123456789', 8);
console.log(shortId); // "aB3xY9Zk"
```

## Usage Patterns

### In Components
```vue
<script setup>
import { getShortId } from '~/utils';
import { computedAsync } from '@vueuse/core';

const shortId = computedAsync(async () => {
  return getShortId(props.messageId, 8);
}, null);
</script>
```

### In Composables
```ts
import { getShortIdSync } from '~/utils';

export const useUser = () => {
  const getDisplayId = (userId: string) => {
    return getShortIdSync(userId, 6);
  };
  
  return { getDisplayId };
};
```
