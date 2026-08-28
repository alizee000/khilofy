import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Toy, User, Owner } from '../data/types';
import { CURRENT_USER, OWNERS, TOYS as MOCK_TOYS } from '../data/seedData';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface AppState {
  user: User;
  toys: Toy[];
  owners: Record<string, Owner>;
  activeRentals: Toy[];
  searchQuery: string;
  cart: Toy[];
}

type Action =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_TOYS'; payload: Toy[] }
  | { type: 'SET_RENTALS'; payload: Toy[] }
  | { type: 'RENT_TOY'; payload: Toy }
  | { type: 'ADD_TOY'; payload: Toy }
  | { type: 'ADD_TO_CART'; payload: Toy }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' };

const initialState: AppState = {
  user: CURRENT_USER, // Will eventually be replaced entirely by AuthContext profile
  toys: MOCK_TOYS, // Fallback to mock data initially
  owners: OWNERS,
  activeRentals: [],
  searchQuery: '',
  cart: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_TOYS':
      return { ...state, toys: action.payload };
    case 'SET_RENTALS':
      return { ...state, activeRentals: action.payload };
    case 'RENT_TOY':
      if (state.activeRentals.find(t => t.id === action.payload.id)) return state;
      return { 
        ...state, 
        activeRentals: [...state.activeRentals, action.payload],
        user: {
          ...state.user,
          toyLoopScore: state.user.toyLoopScore + 10
        }
      };
    case 'ADD_TOY':
      return {
        ...state,
        toys: [action.payload, ...state.toys]
      };
    case 'ADD_TO_CART':
      if (state.cart.find(t => t.id === action.payload.id)) return state;
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(t => t.id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
}

// Helper to map Convex docs to camelCase Toy objects
const mapConvexToy = (row: any): Toy => ({
  id: row._id,
  name: row.name,
  description: row.description || '',
  category: row.category,
  images: row.images || ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'],
  ownerId: row.ownerId,
  ageRange: row.ageRange || '3-5',
  condition: row.condition || 'Good',
  isCleanedAndChecked: row.isCleaned,
  rentalRates: {
    oneDay: row.oneDayRate,
    threeDays: Math.floor(row.oneDayRate * 2.5),
    sevenDays: Math.floor(row.oneDayRate * 5),
    thirtyDays: Math.floor(row.oneDayRate * 15),
  },
  deposit: row.deposit,
  location: { address: 'Bangalore', lat: 12.9, lng: 77.5, deliveryMinutes: 30 },
  isAvailableToday: row.isAvailable,
  rating: 5.0,
  reviewsCount: 0,
  recentRentalsCount: 0,
  targetGender: row.targetGender || 'Unisex',
  createdAt: row._creationTime,
});

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { session } = useAuth(); // session is now a boolean from Clerk

  const convexToys = useQuery(api.toys.list);
  const convexRentals = useQuery(api.rentals.getMyRentals);

  useEffect(() => {
    if (convexToys) {
      dispatch({ type: 'SET_TOYS', payload: convexToys.map(mapConvexToy) });
    }
  }, [convexToys]);

  useEffect(() => {
    if (!session) {
      dispatch({ type: 'SET_RENTALS', payload: [] });
      return;
    }
    if (convexRentals) {
      // convexRentals returns an array of { ..., toy: {...} }
      const rentedToys = convexRentals.map((r: any) => mapConvexToy(r.toy));
      dispatch({ type: 'SET_RENTALS', payload: rentedToys });
    }
  }, [convexRentals, session]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
