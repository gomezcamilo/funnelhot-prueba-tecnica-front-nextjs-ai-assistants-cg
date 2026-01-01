'use client';

import * as React from 'react';

const TOAST_LIMIT = 1;

type ToasterToast = {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  onClick?: () => void;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | { type: ActionType['ADD_TOAST']; toast: ToasterToast }
  | { type: ActionType['REMOVE_TOAST']; toastId?: string };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) return { ...state, toasts: [] };
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) };
  }
};

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

type Toast = Omit<ToasterToast, 'id'>;

function toast({ duration = 3000, ...props }: Toast) {
  const id = genId();
  
  // Limpiar timeout anterior si existe
  if (toastTimeouts.has(id)) {
    clearTimeout(toastTimeouts.get(id));
  }

  const remove = () => {
    if (toastTimeouts.has(id)) {
      clearTimeout(toastTimeouts.get(id));
      toastTimeouts.delete(id);
    }
    dispatch({ type: 'REMOVE_TOAST', toastId: id });
  };

  dispatch({
    type: 'ADD_TOAST',
    toast: { ...props, id, duration, onClick: props.onClick },
  });

  // Auto-dismiss después del duration
  const timeout = setTimeout(remove, duration);
  toastTimeouts.set(id, timeout);

  return { id, dismiss: remove };
}

function dismissToast(toastId: string) {
  if (toastTimeouts.has(toastId)) {
    clearTimeout(toastTimeouts.get(toastId));
    toastTimeouts.delete(toastId);
  }
  dispatch({ type: 'REMOVE_TOAST', toastId });
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: dismissToast,
  };
}

export { useToast, toast };
