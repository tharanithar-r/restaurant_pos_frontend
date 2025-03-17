/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardBody, Button, Image } from "@nextui-org/react";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartItem } from "../../redux/cart/cartSlice";
import { updateCart, updateQtyAndSync } from "../../redux/cart/cartAction";
import { AppDispatch, RootState } from "../../redux/store";
import no_image_img from "../../assets/images/no_image.png";
import { MinusIcon } from "../icons/MinusIcon";
import { PlusIcon } from "../icons/PlusIcon";
import { useLoadingAction } from "../../hooks/useLoading";

const ItemCard = memo(({ item }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.cart);
  const { withLoading } = useLoadingAction();

  const activeCartItem = cartItems.find(
    (cartItem) => cartItem.ItemCode === item.ItemCode
  );

  const [Qty, setQty] = useState(
    activeCartItem ? activeCartItem.Qty.toString() : "1"
  );

  useEffect(() => {
    if (activeCartItem) {
      setQty(activeCartItem.Qty.toString());
    }
  }, [activeCartItem]);

  const handleAddToCart = useCallback(async () => {
    try {
      const newItem: CartItem = {
        ItemCode: item.ItemCode,
        Description: item.Description,
        MaxRate: Number(item.MaxRate),
        Qty: Number(Qty),
        Amount: Number(Qty) * item.MaxRate,
      };

      await withLoading(async () => {
        await dispatch(updateCart(newItem)).unwrap();
      }, "cart");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  }, [dispatch, item, Qty, withLoading]);

  const handleBtnClick = async () => {
    setQty("1");
    await handleAddToCart();
  };

  const handleUpdQty = async (newQty: number) => {
    if (newQty < 1) return;

    try {
      await withLoading(async () => {
        await dispatch(
          updateQtyAndSync({
            ItemCode: item.ItemCode,
            Qty: newQty,
          })
        ).unwrap();
      }, "cart");

      setQty(newQty.toString());
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  return (
    <>
      <Card
        classNames={{
          base: `!border-solid ${
            !activeCartItem ? "!border-gray-800" : "!border-primary"
          } border-2`,
          body: "flex flex-col h-full p-0",
        }}
      >
        <CardBody className="p-0">
          <div className="flex flex-col items-center flex-grow p-0">
            <div className="w-full aspect-w-16 aspect-h-9 max-h-[150px] sm:max-h-[200px] md:max-h-[230px] lg:max-h-[280px]] overflow-hidden flex justify-center items-center">
              <Image
                className="object-cover w-full h-full"
                src={
                  item.ItemImage !== ""
                    ? `data:image/jpeg;base64,${item.ItemImage}`
                    : no_image_img
                }
                alt={item.Description}
              />
            </div>
            <div className="flex w-full p-2">
              <div className="px-1 items-center justify-center flex w-full whitespace-break-spaces font-semibold">
                {item.Description}
              </div>
            </div>
            <div className="mt-auto w-full flex flex-col items-center p-2">
              <div className="flex mb-3">
                <div className="font-semibold text-white">
                  &#8377;{Intl.NumberFormat("en-IN").format(item.MaxRate)}
                </div>
              </div>
              {!activeCartItem ? (
                <Button
                  onClick={handleBtnClick}
                  color="primary"
                  type="button"
                  radius="full"
                  fullWidth
                  className="!mt-auto"
                >
                  Add to Cart
                </Button>
              ) : (
                <div className="flex items-center">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="warning"
                    radius="full"
                    style={{ color: "#86c2dc" }}
                    onClick={() => {
                      const newQty = Number(Qty) - 1;
                      handleUpdQty(newQty);
                    }}
                  >
                    <MinusIcon />
                  </Button>
                  <div className="font-bold mr-[10px] ml-[10px]">
                    {activeCartItem.Qty}
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="warning"
                    radius="full"
                    style={{ color: "#86c2dc" }}
                    onClick={() => {
                      const newQty = Number(Qty) + 1;
                      handleUpdQty(newQty);
                    }}
                  >
                    <PlusIcon />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
});

export default ItemCard;
