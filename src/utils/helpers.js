export const addItemToCart = (cart, item) => {
  const existingItem = cart.find((i) => i.item_name === item.item_name);
  if (existingItem) {
    return cart.map((i) =>
      i.item_name === item.item_name ? { ...i, quantity: i.quantity + 1 } : i
    );
  }
  return [...cart, { ...item, quantity: 1 }];
};

export const removeItemFromCart = (cart, item) => {
  return cart
    .map((i) =>
      i.item_name === item.item_name ? { ...i, quantity: i.quantity - 1 } : i
    )
    .filter((i) => i.quantity > 0);
};

export const getTotalAmount = (cart) => {
  return cart.reduce(
    (total, item) => total + item.rate_per_unit * item.quantity,
    0
  );
};
export const getTotalQuantity = (cart) => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};
