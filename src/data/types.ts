export type ToyCondition = 'Like New' | 'Excellent' | 'Good' | 'Fair';

export interface Location {
  address: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  deliveryMinutes?: number;
}

export interface Owner {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  reviewsCount: number;
  trustScore: number;
  type: 'Parent Seller' | 'Toy Store' | 'Event Partner';
  verified: boolean;
}

export interface Toy {
  id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  ownerId: string;
  ageRange: string;
  condition: ToyCondition;
  isCleanedAndChecked: boolean;
  rentalRates: {
    oneDay: number;
    threeDays: number;
    sevenDays: number;
    thirtyDays: number;
  };
  deposit: number;
  location: Location;
  isAvailableToday: boolean;
  rating: number;
  reviewsCount: number;
  recentRentalsCount: number; // for trending score
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  location: Location;
  toyLoopScore: number;
  badges: string[];
  earnings: number;
}
