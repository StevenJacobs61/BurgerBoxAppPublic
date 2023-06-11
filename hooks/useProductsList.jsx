import { useEffect, useState } from 'react';

const useProductsList = (order, products, fries) => {
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const productsLookup = products.reduce((lookup, product) => {
      lookup[product.stripeId] = {
        price: product.stripeId,
        quantity: 0,
      };
      return lookup;
    }, {});

    order.orders.forEach((order) => {
      const product = productsLookup[order.product.stripeId];
      if (product) {
        product.quantity += parseInt(order.quantity);
      }
      order.extraOptions.forEach((extra) => {
        const extraProduct = productsLookup[extra.stripeId];
        if (extraProduct) {
          extraProduct.quantity += parseInt(order.quantity);
        }
      });
      order.extraUpgrades.forEach((upgrade) => {
        const upgradeProduct = productsLookup[upgrade.stripeId];
        if (upgradeProduct) {
          upgradeProduct.quantity++;
        }
      });
      if (order.fries) {
        const friesProduct = productsLookup[fries.stripeId];
        if (friesProduct) {
          friesProduct.quantity += parseInt(order.quantity);
        }
      }
    });

    const preDeliveryProducts = Object.values(productsLookup).filter(
      (product) => product.quantity !== 0
    );

    if (order.delivery) {
      let deliveryFeeProduct = null;
      if (order.deliveryCost === 3) {
        deliveryFeeProduct = { price: process.env.NEXT_PUBLIC_STRIPE_DELIVERY_FEE_3, quantity: 1 };
      } else if (order.deliveryCost === 5) {
        deliveryFeeProduct = { price: process.env.NEXT_PUBLIC_STRIPE_DELIVERY_FEE_5, quantity: 1 };
      } else if (order.deliveryCost === 6) {
        deliveryFeeProduct = { price: process.env.NEXT_PUBLIC_STRIPE_DELIVERY_FEE_6, quantity: 1 };
      }
      if (deliveryFeeProduct) {
        preDeliveryProducts.push(deliveryFeeProduct);
      }
    }

    setProductsList(preDeliveryProducts);
  }, [order, products, fries]);

  return productsList;
};

export default useProductsList;
