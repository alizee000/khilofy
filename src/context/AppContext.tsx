import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Toy, User, Owner } from '../data/types';
import { TOYS, CURRENT_USER, OWNERS } from '../data/seedData';

interface AppState {
  user: User;
  toys: Toy[];
  owners: Record<string, Owner>;
  activeRentals: Toy[];
  searchQuery: string;
}

type Action =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'RENT_TOY'; payload: Toy }
  | { type: 'ADD_TOY'; payload: Toy };

const initialState: AppState = {
  user: CURRENT_USER,
  toys: TOYS,
  owners: OWNERS,
  activeRentals: [],
  searchQuery: '',
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'RENT_TOY':
      // Deduplicate if already rented (for MVP simplicity)
      if (state.activeRentals.find(t => t.id === action.payload.id)) return state;
      return { 
        ...state, 
        activeRentals: [...state.activeRentals, action.payload],
        user: {
          ...state.user,
          toyLoopScore: state.user.toyLoopScore + 10 // gamification!
        }
      };
    case 'ADD_TOY':
      return {
        ...state,
        toys: [action.payload, ...state.toys]
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
