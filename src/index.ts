import { autorun } from "mobx";
import { useEffect, useRef, useState } from "react";

// reference: https://github.com/reduxjs/react-redux/blob/master/src/utils/shallowEqual.ts
function is(x: unknown, y: unknown) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

export default function shallowEqual(objA: any, objB: any) {
  if (is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);

  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

type EqualityFn<T> = (previous: T, next: T) => boolean;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

const refEquality: EqualityFn<any> = (a, b) => a === b;

export function useMobxSelector<TStore, Selected>(
  store: TStore,
  selector: (store: NonFunctionProperties<TStore>) => Selected,
  equalityFn: EqualityFn<Selected> = refEquality
) {
  const latestRef = useRef<Selected>(selector(store));

  const [state, setState] = useState<Selected>(selector(store));

  useEffect(() => {
    const disposer = autorun(() => {
      const result = selector(store);

      const isEqual = equalityFn(latestRef.current, result);

      if (!isEqual) {
        latestRef.current = result;
        setState(result);
      }
    });

    return () => {
      disposer();
    };
  }, [selector, equalityFn, store, state]);

  return state;
}
