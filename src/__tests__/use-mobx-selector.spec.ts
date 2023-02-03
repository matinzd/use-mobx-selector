import { makeAutoObservable, runInAction } from "mobx";
import { renderHook } from "@testing-library/react-hooks";
import { useMobxSelector } from "..";

class TestMobxClass {
  foo = "foo";

  bar = "bar";

  constructor() {
    makeAutoObservable(this);
  }
}

describe("useMobxSelector", () => {
  it("should return selected value properly", async () => {
    const store = new TestMobxClass();

    const selector = (st: typeof store) => st.foo;

    const equalityFn = jest.fn();

    const { result, unmount, waitFor } = renderHook(() =>
      useMobxSelector(store, selector, equalityFn)
    );

    await waitFor(() => expect(equalityFn).toBeCalledTimes(1));

    expect(result.current).toBe("foo");

    runInAction(() => {
      store.foo = "baz";
    });

    expect(equalityFn).toBeCalledTimes(2);

    expect(result.current).toBe("baz");

    runInAction(() => {
      store.bar = "abcdef";
    });

    expect(equalityFn).toBeCalledTimes(2);

    expect(result.current).toBe("baz");

    unmount();
  });
});
