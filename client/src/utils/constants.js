export const TSHIRT_TYPES = [
  { id: 'vraie coton', name: 'Vraie Coton' },
  { id: 'polo', name: 'Polo' },
  { id: '160', name: '160' },
  { id: '115', name: '115' },
];

export const SIZES = {
  CHILDREN: ['2 ans', '4 ans', '6 ans', '8 ans', '10 ans'],
  ADULTS: ['S', 'M', 'L', 'XL', 'XXL'],
};

export const ALL_SIZES = [...SIZES.CHILDREN, ...SIZES.ADULTS];

export const PRICES = {
  'vraie coton': {
    '2 ans': 3000,
    '4 ans': 5000,
    '6 ans': 5000,
    '8 ans': 7000,
    '10 ans': 7000,
    'S': 8000,
    'M': 9000,
    'L': 10000,
    'XL': 12000,
    'XXL': 12000,
  },
  'polo': {
    '2 ans': 3000,
    '4 ans': 5000,
    '6 ans': 5000,
    '8 ans': 7000,
    '10 ans': 7000,
    'S': 8000,
    'M': 9000,
    'L': 10000,
    'XL': 12000,
    'XXL': 12000,
  },
  '160': {
    'S': 5000,
    'M': 6000,
    'L': 6000,
    'XL': 7000,
    'XXL': 7000,
  },
  '115': {
    '2 ans': 1500,
    '4 ans': 2000,
    '6 ans': 2500,
    '8 ans': 3000,
    '10 ans': 3000,
    'S': 3500,
    'M': 4000,
    'L': 4000,
    'XL': 5000,
    'XXL': 5000,
  },
};
