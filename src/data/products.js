/**
 * Exact 19 product fields in specified order:
 * 1. TM 1000
 * 2. TM 500
 * 3. TM 200
 * 4. PURE 500
 * 5. PURE LOOSE
 * 6. GOLD 500
 * 7. GOLD LOOSE
 * 8. TM LOOSE
 * 9. TEA SPL 500 ML
 * 10. TM 120
 * 11. SPECIAL 500
 * 12. SPECIAL LOOSE
 * 13. TM 6 LTRS
 * 14. PM 6 LTRS
 * 15. GM 6 LTRS
 * 16. COW MILK
 * 17. STM 125
 * 18. THICK 500
 * 19. SPECIAL 6 LTRS
 */

export const PRODUCTS = [
  { id: 'tm_1000', name: 'TM 1000', order: 1, unit: 'Pouches (1L)', category: 'Toned Milk', badge: '1000 ML' },
  { id: 'tm_500', name: 'TM 500', order: 2, unit: 'Pouches (500ml)', category: 'Toned Milk', badge: '500 ML' },
  { id: 'tm_200', name: 'TM 200', order: 3, unit: 'Pouches (200ml)', category: 'Toned Milk', badge: '200 ML' },
  { id: 'pure_500', name: 'PURE 500', order: 4, unit: 'Pouches (500ml)', category: 'Pure Milk', badge: '500 ML' },
  { id: 'pure_loose', name: 'PURE LOOSE', order: 5, unit: 'Litres', category: 'Pure Milk', badge: 'Loose' },
  { id: 'gold_500', name: 'GOLD 500', order: 6, unit: 'Pouches (500ml)', category: 'Gold Milk', badge: '500 ML' },
  { id: 'gold_loose', name: 'GOLD LOOSE', order: 7, unit: 'Litres', category: 'Gold Milk', badge: 'Loose' },
  { id: 'tm_loose', name: 'TM LOOSE', order: 8, unit: 'Litres', category: 'Toned Milk', badge: 'Loose' },
  { id: 'tea_spl_500_ml', name: 'TEA SPL 500 ML', order: 9, unit: 'Pouches (500ml)', category: 'Tea Special', badge: 'Tea Spl' },
  { id: 'tm_120', name: 'TM 120', order: 10, unit: 'Pouches (120ml)', category: 'Toned Milk', badge: '120 ML' },
  { id: 'special_500', name: 'SPECIAL 500', order: 11, unit: 'Pouches (500ml)', category: 'Special Milk', badge: '500 ML' },
  { id: 'special_loose', name: 'SPECIAL LOOSE', order: 12, unit: 'Litres', category: 'Special Milk', badge: 'Loose' },
  { id: 'tm_6_ltrs', name: 'TM 6 LTRS', order: 13, unit: '6L Cans/Pouch', category: 'Bulk (6L)', badge: '6 Litres' },
  { id: 'pm_6_ltrs', name: 'PM 6 LTRS', order: 14, unit: '6L Cans/Pouch', category: 'Bulk (6L)', badge: '6 Litres' },
  { id: 'gm_6_ltrs', name: 'GM 6 LTRS', order: 15, unit: '6L Cans/Pouch', category: 'Bulk (6L)', badge: '6 Litres' },
  { id: 'cow_milk', name: 'COW MILK', order: 16, unit: 'Litres/Pouches', category: 'Cow Milk', badge: 'Fresh Cow' },
  { id: 'stm_125', name: 'STM 125', order: 17, unit: 'Pouches (125ml)', category: 'Standard Milk', badge: '125 ML' },
  { id: 'thick_500', name: 'THICK 500', order: 18, unit: 'Pouches (500ml)', category: 'Thick Milk', badge: '500 ML' },
  { id: 'special_6_ltrs', name: 'SPECIAL 6 LTRS', order: 19, unit: '6L Cans/Pouch', category: 'Bulk (6L)', badge: '6 Litres' },
];

/**
 * Returns empty product values (all empty strings)
 */
export const getInitialProductValues = () => {
  return PRODUCTS.reduce((acc, product) => {
    acc[product.name] = '';
    return acc;
  }, {});
};
