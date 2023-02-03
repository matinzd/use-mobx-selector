# MobX Selector

A library that provides a hook to bind a MobX store to a React component.

## Installation

```
yarn add use-mobx-selector
```

## Usage

```javascript
import { makeAutoObservable } from "mobx";
import { useMobxSelector } from "use-mobx-selector";

class MobxStore {
    ids: string[] = []

    constructor() {
        makeAutoObservable(this)
    }
}

const store = new MobxStore()

const Component = (props) => {
  const isFooAvailable = useMobxSelector(store, (store) => store.ids.includes('foo'));

  return (
    <div>
      {isFooAvailable}
    </div>
  );
};
```

## API

`useMobxSelector(store, selector, equalityFn?)`

A hook that binds the `store` to the component and re-renders the component when the result of the `selector` function changes.

### Arguments

- `store`: A MobX store object.
- `selector`: A function that takes the store as an argument and returns the selected data.
- `equalityFn` (optional): A function that takes the previous selected data and the next selected data, and returns true if they are equal. If not provided, it will use reference equality.

### Returns

The selected data returned from the selector function.

## License

MIT.
