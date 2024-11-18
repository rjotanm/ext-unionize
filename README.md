# Externally Unionize

This package provide extension for original [unionize](https://github.com/pelotom/unionize) package, for create Externally tagged representation.

Externally tagged enum representation provide by default via Rust Serde and for Python Pydantic via [typenum](https://github.com/rjotanm/typenum) library.

Dependency from [unionize](https://github.com/pelotom/unionize) unnecessary, but it small and not affect to compiled code (when not used), therefore insert into dependency intentionally.

Compatability with Python\Rust provided representation described in [typenum](https://github.com/rjotanm/typenum) package.

# Example

#### Internally (original unionize)
```typescript
import { unionize, ofType } from 'unionize';

const MyEnym = unionize({
  First: ofType<{ id: number; text: string }>(),
  Second: ofType<{ id: number; }>(),
});

// {"tag":"First","id":1,"text":"test"}
console.log(JSON.stringify(MyEnum.First({ id: 1, text: "test" })))
```

#### Adjacently (original unionize)
```typescript
import { unionize, ofType } from 'unionize';

const MyEnym = unionize({
  First: ofType<{ id: number; text: string }>(),
  Second: ofType<{ id: number; }>(),
}, {tag: "tag", value: "value"});

// {"tag":"First","value":{"id":1,"text":"test"}}
console.log(JSON.stringify(MyEnum.First({ id: 1, text: "test" })))
```

#### Externally
```typescript
import { ofType } from 'unionize';
import { extUnionize } from 'ext-unionize';

const MyEnym = extUnionize({
  First: ofType<{ id: number; text: string }>(),
  Second: ofType<{ id: number; }>(),
});

// {"First":{"id":1,"text":"test"}}
console.log(JSON.stringify(MyEnum.First({ id: 1, text: "test" })))
```
