import { Toy, Owner, User } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Sarah',
  avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
  location: {
    address: 'Koramangala, Bangalore',
    lat: 12.9279,
    lng: 77.6271,
  },
  toyLoopScore: 96,
  badges: ['🎯 First Rental', '♻️ Smart Parent'],
  earnings: 4280,
};

export const OWNERS: Record<string, Owner> = {
  'o1': {
    id: 'o1',
    name: 'Priya S.',
    avatarUrl: 'https://i.pravatar.cc/150?u=priya',
    rating: 4.9,
    reviewsCount: 34,
    trustScore: 98,
    type: 'Parent Seller',
    verified: true,
  },
  'o2': {
    id: 'o2',
    name: 'Kiddie World',
    avatarUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=150&q=80',
    rating: 4.7,
    reviewsCount: 128,
    trustScore: 95,
    type: 'Toy Store',
    verified: true,
  }
};

export const TOYS: Toy[] = [
  {
    id: 't1',
    name: 'LEGO City Space Station 🚀',
    description: 'Awesome LEGO City Space Station with astronauts, solar panels, and a space capsule. Perfect for weekend building!',
    category: 'Building Blocks',
    images: [
      'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'o1',
    ageRange: '6-12',
    condition: 'Excellent',
    isCleanedAndChecked: true,
    rentalRates: {
      oneDay: 149,
      threeDays: 299,
      sevenDays: 499,
      thirtyDays: 999,
    },
    deposit: 1000,
    location: {
      address: 'HSR Layout',
      lat: 12.9121,
      lng: 77.6446,
      distanceKm: 1.8,
      deliveryMinutes: 35,
    },
    isAvailableToday: true,
    rating: 4.9,
    reviewsCount: 12,
    recentRentalsCount: 17,
    createdAt: '2023-10-01T00:00:00Z',
  },
  {
    id: 't2',
    name: 'Remote Control Racing Buggy',
    description: 'Fast RC car, works perfectly on dirt and grass. Batteries included.',
    category: 'RC Vehicles',
    images: [
      'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'o2',
    ageRange: '5-10',
    condition: 'Good',
    isCleanedAndChecked: true,
    rentalRates: {
      oneDay: 99,
      threeDays: 249,
      sevenDays: 399,
      thirtyDays: 899,
    },
    deposit: 500,
    location: {
      address: 'Indiranagar',
      lat: 12.9784,
      lng: 77.6408,
      distanceKm: 4.2,
      deliveryMinutes: 45,
    },
    isAvailableToday: true,
    rating: 4.6,
    reviewsCount: 45,
    recentRentalsCount: 8,
    createdAt: '2023-09-15T00:00:00Z',
  },
  {
    id: 't3',
    name: 'Montessori Busy Board',
    description: 'Educational wooden busy board for toddlers. Enhances fine motor skills.',
    category: 'Educational',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'o1',
    ageRange: '1-3',
    condition: 'Like New',
    isCleanedAndChecked: true,
    rentalRates: {
      oneDay: 79,
      threeDays: 199,
      sevenDays: 299,
      thirtyDays: 699,
    },
    deposit: 800,
    location: {
      address: 'Koramangala',
      lat: 12.9279,
      lng: 77.6271,
      distanceKm: 0.5,
      deliveryMinutes: 15,
    },
    isAvailableToday: true,
    rating: 5.0,
    reviewsCount: 22,
    recentRentalsCount: 25,
    createdAt: '2023-11-10T00:00:00Z',
  },
  {
    id: 't-dog-1',
    name: 'Interactive Puzzle Feeder for Dogs',
    description: 'Keep your furry friend mentally stimulated with this interactive puzzle toy. Hide treats inside and watch them solve the puzzle! Perfect for rainy days or when you need to keep them busy.',
    category: 'Dog',
    images: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'o1',
    ageRange: 'All Ages',
    condition: 'Excellent',
    isCleanedAndChecked: true,
    rentalRates: {
      oneDay: 49,
      threeDays: 99,
      sevenDays: 199,
      thirtyDays: 499,
    },
    deposit: 500,
    location: {
      address: 'Koramangala',
      lat: 12.9279,
      lng: 77.6271,
      distanceKm: 0.5,
      deliveryMinutes: 15,
    },
    isAvailableToday: true,
    rating: 4.8,
    reviewsCount: 15,
    recentRentalsCount: 30,
    createdAt: '2023-11-15T00:00:00Z',
  }
];
