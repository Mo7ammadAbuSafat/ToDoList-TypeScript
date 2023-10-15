// This an implementation for useState hook
export interface SetState<T> {
  (value: T): void;
}

export interface GetState<T> {
  (): T;
}

export type UseStateReturn<T> = [GetState<T>, SetState<T>];

export const useState = <Type>(initValue?: Type): UseStateReturn<Type> => {
  let value: Type = initValue;

  const get: GetState<Type> = () => value;

  const setState: SetState<Type> = (newValue) => {
    value = newValue;
  };

  return [get, setState];
};
