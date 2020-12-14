import store from '.'
import type { Equal, Expect } from '@type-challenges/utils'

let s1: any = store().test
let v1: string = store('k1')
let exists1 = store('?k')
type exists1 = Expect<Equal<typeof exists1, boolean>>

store('k1', 'v1').set('k2', 'v2')
store({ k1: 'v1', k2: 'v2' }).set('k3', 'v3')

store('key', (key) => {
  type k = Expect<Equal<'key', typeof key>>
})
store(['k1', 'k2'] as const, (key) => {
  type k = Expect<Equal<'k1' | 'k2', typeof key>>
})

let v2: any = store.get().k2
let v3: string = store.get('k3')
let exists2 = store.get('?k')
type exists2 = Expect<Equal<typeof exists2, boolean>>
let entries1 = store.get('a', 'b', 'c')
type keys1 = Expect<Equal<keyof typeof entries1, 'a' | 'b' | 'c'>>

store.set({ k1: 'v1', k2: 'v2' }).set('k3', 'v3')

let exists3 = store.has('k')
type exists3 = Expect<Equal<typeof exists3, boolean>>

let v4: any = store.remove('k4')

let keys = store.keys()
type keys = Expect<Equal<typeof keys, string[]>>

store.clear()
  .forEach((key, value: any) => {
    type key = Expect<Equal<typeof key, string>>
  })

let k5: any = store.search('k').k5
