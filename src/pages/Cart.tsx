import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import CartCard from "../components/ui/CartCard";
import { getCartTotal } from "../redux/cart/cartSlice";
import { Button, Card, CardBody } from "@nextui-org/react";
import { createOrder } from "../redux/orders/orderAction";
import { getCartSync } from "../redux/cart/cartAction";
import emptyCart from "../assets/images/empty-cart.png";
import { useEffect, useState } from "react";

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.cart);
  const cartTotal = useSelector((state: RootState) => getCartTotal(state));
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  // Keep previous cart items during loading
  const [previousItems, setPreviousItems] = useState(cartItems);

  useEffect(() => {
    if (!isLoading) {
      setPreviousItems(cartItems);
    }
  }, [cartItems, isLoading]);

  // Use previous items during loading, current items otherwise
  const displayItems = isLoading ? previousItems : cartItems;

  const handleOrder = async () => {
    try {
      const orderData = { items: cartItems };
      await dispatch(createOrder(orderData)).unwrap();
      await dispatch(getCartSync()).unwrap();
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  return (
    <>
      {displayItems.length > 0 ? (
        <>
          <div className="my-4 pb-[170px]">
            {cartItems.map((item) => (
              <CartCard item={item} key={item.ItemCode} />
            ))}
          </div>
          <div className="fixed bottom-0 left-0 right-0 ml-6 mr-8 mb-[105px]">
            <Card isBlurred className="!bg-gray-200 text-black">
              <CardBody className="">
                <div className="flex justify-between w-full mb-3 p-1 font-semibold">
                  <label>Total: </label>
                  <label className="text-right ">
                    &#8377;{Intl.NumberFormat("en-IN").format(cartTotal)}
                  </label>
                </div>
                <Button
                  fullWidth
                  onClick={handleOrder}
                  className="!bg-warning-400 !text-black"
                  radius="full"
                >
                  Checkout
                </Button>
              </CardBody>
            </Card>
          </div>
        </>
      ) : !isLoading ? (
        <div className="flex flex-col items-center min-h-screen mt-32">
          <img
            className="h-[250px] w-[250px] sm:h-60 sm:w-60 md:h-80 md:w-80"
            src={emptyCart}
            alt="Empty Cart"
          />
          <label className="text-center text-base sm:text-base md:text-lg">
            Cart is Empty
          </label>
        </div>
      ) : null}
    </>
  );
};

export default Cart;
