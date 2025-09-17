import { Coffee, Pizza, IceCream } from 'lucide-react';

export const menuItems = {
  coffee: [
    { id: 1, name: 'Espresso', price: 18, available: true },
    // ...
  ],
  food: [
    { id: 8, name: 'Chicken Sandwich', price: 35, available: true },
    // ...
  ],
  dessert: [
    { id: 13, name: 'Ice Cream', price: 15, available: true },
    // ...
  ],
};

export const categories = [
  { id: 'coffee', name: 'Coffee', icon: Coffee },
  { id: 'food', name: 'Food', icon: Pizza },
  { id: 'dessert', name: 'Desserts', icon: IceCream },
];
