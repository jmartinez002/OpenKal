export const FOODS = [
  'Apple', 'Avocado', 'Bacon', 'Bagel', 'Banana', 'BBQ Chicken', 'Beef Tacos',
  'Black Beans', 'BLT Sandwich', 'Blueberries', 'Breakfast Burrito', 'Broccoli',
  'Brown Rice', 'Buffalo Wings', 'Burrito Bowl', 'Butter', 'Caesar Salad',
  'Cheddar Cheese', 'Cheerios', 'Cheese Pizza', 'Cheeseburger', 'Chicken Breast',
  'Chicken Burrito', 'Chicken Caesar Salad', 'Chicken Nuggets', 'Chicken Sandwich',
  'Chicken Wings', 'Chips and Salsa', 'Chocolate Cake', 'Chocolate Chip Cookies',
  'Chocolate Milk', 'Cinnamon Roll', 'Club Sandwich', 'Coca-Cola', 'Coffee',
  'Corn', 'Cottage Cheese', 'Cream Cheese', 'Croissant', 'Cucumber',
  'Doughnut', 'Egg McMuffin', 'Eggs', 'Energy Drink', 'Fettuccine Alfredo',
  'Fish and Chips', 'Fish Tacos', 'French Fries', 'French Toast', 'Fried Chicken',
  'Fried Rice', 'Frozen Yogurt', 'Fruit Salad', 'Garlic Bread', 'Granola Bar',
  'Grapes', 'Greek Salad', 'Greek Yogurt', 'Green Salad', 'Grilled Cheese',
  'Grilled Chicken', 'Grilled Salmon', 'Ground Beef', 'Guacamole', 'Ham',
  'Hamburger', 'Hard Boiled Eggs', 'Hash Browns', 'Hot Dog', 'Hummus',
  'Ice Cream', 'Iced Coffee', 'Iced Tea', 'Italian Dressing', 'Kale Salad',
  'Lasagna', 'Latte', 'Lemonade', 'Lentil Soup', 'Lobster', 'Mac and Cheese',
  'Mango', 'Mashed Potatoes', 'Meatballs', 'Milk', 'Milkshake', 'Muffin',
  'Nachos', 'Noodles', 'Oatmeal', 'Olive Oil', 'Onion Rings', 'Orange',
  'Orange Juice', 'Pad Thai', 'Pancakes', 'Pasta', 'Peanut Butter',
  'Peanut Butter and Jelly', 'Pepperoni Pizza', 'Pho', 'Pineapple',
  'Pita Bread', 'Pizza', 'Popcorn', 'Pork Chops', 'Potato Chips',
  'Potato Soup', 'Pretzels', 'Protein Bar', 'Protein Shake', 'Quesadilla',
  'Ramen', 'Ranch Dressing', 'Raspberries', 'Refried Beans', 'Rice',
  'Rice and Beans', 'Ribs', 'Salad', 'Salmon', 'Salsa', 'Scrambled Eggs',
  'Shrimp', 'Soda', 'Soup', 'Spaghetti', 'Spaghetti Bolognese', 'Steak',
  'Stir Fry', 'Strawberries', 'Sushi', 'Sweet Potato', 'Sweet Potato Fries',
  'Tacos', 'Toast', 'Tofu', 'Tomato Soup', 'Tortilla Chips', 'Trail Mix',
  'Tuna Salad', 'Turkey Sandwich', 'Veggie Burger', 'Waffles', 'Watermelon',
  'White Rice', 'Whole Milk', 'Wrap', 'Yogurt',
];

export function getSuggestions(query: string, max = 5): string[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const starts = FOODS.filter(f => f.toLowerCase().startsWith(q));
  const contains = FOODS.filter(f => !f.toLowerCase().startsWith(q) && f.toLowerCase().includes(q));
  return [...starts, ...contains].slice(0, max);
}
