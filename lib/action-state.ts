import React from "react";

export function useActionStateFallback<State, Action extends (...args: any[]) => any>(action: Action, initialState: State): [State, Action] {
  const useActionState = (React as any).useActionState as ((action: Action, initialState: State) => [State, Action]) | undefined;
  if (typeof useActionState === "function") {
    return useActionState(action, initialState);
  }
  return [initialState, action];
}
