/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * React Context + reducer state root for AXON (Stage 1A).
 * Choice: Context + useReducer — no extra dependencies, typed actions,
 * single source of truth for the declared global shape, and a clear
 * path to migrate remaining global fields in later stages.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import {
  axonReducer,
  initialAxonState,
  type AxonState,
  type AxonAction,
} from './axonState';

const AxonStateContext = createContext<AxonState | null>(null);
const AxonDispatchContext = createContext<Dispatch<AxonAction> | null>(null);

export function AxonStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(axonReducer, initialAxonState);

  return (
    <AxonStateContext.Provider value={state}>
      <AxonDispatchContext.Provider value={dispatch}>
        {children}
      </AxonDispatchContext.Provider>
    </AxonStateContext.Provider>
  );
}

export function useAxonState(): AxonState {
  const ctx = useContext(AxonStateContext);
  if (ctx === null) {
    throw new Error('useAxonState must be used within AxonStateProvider');
  }
  return ctx;
}

export function useAxonDispatch(): Dispatch<AxonAction> {
  const ctx = useContext(AxonDispatchContext);
  if (ctx === null) {
    throw new Error('useAxonDispatch must be used within AxonStateProvider');
  }
  return ctx;
}

/** Convenience: open / close the Design Tokens modal via the state root. */
export function useTokensModal() {
  const { isTokensModalOpen } = useAxonState();
  const dispatch = useAxonDispatch();
  return {
    isTokensModalOpen,
    openTokensModal: () =>
      dispatch({ type: 'SET_TOKENS_MODAL_OPEN', payload: true }),
    closeTokensModal: () =>
      dispatch({ type: 'SET_TOKENS_MODAL_OPEN', payload: false }),
  };
}
