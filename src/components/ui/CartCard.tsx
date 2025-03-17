import { Button, Card, CardBody, Image } from "@nextui-org/react";
//import { EditIcon } from "./EditIcon";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  getCartSync,
  updateQtyAndSync,
} from "../../redux/cart/cartAction";
import { CartItem, resetCart } from "../../redux/cart/cartSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { TrashIcon } from "../icons/TrashIcon";
import { PlusIcon } from "../icons/PlusIcon";
import { MinusIcon } from "../icons/MinusIcon";
import no_image_img from "../../assets/images/no_image.png";
import { getCurrentTable } from "../../redux/table/tableSlice";
import { useLoadingAction } from "../../hooks/useLoading";

interface CartState {
  item: CartItem;
}

const CartCard = ({ item }: CartState) => {
  const dispatch = useDispatch<AppDispatch>();
  const { withLoading } = useLoadingAction();
  const [Qty, setQty] = useState(item.Qty.toString());

  const CustomerID = useSelector(
    (state: RootState) => state.customer.CustomerID
  );

  const currentTable = useSelector(getCurrentTable);

  const menuItems = useSelector((state: RootState) => state.menu.items);
  const menuItem = menuItems.find((mi) => mi.ItemCode === item.ItemCode);

  useEffect(() => {
    setQty(item.Qty.toString());
  }, [item.Qty]);

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
        setQty(newQty.toString());
      }, "cart");
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleDelItem = async () => {
    if (!CustomerID || !currentTable) return;

    try {
      await withLoading(async () => {
        const res = await dispatch(
          deleteCartItem({
            ItemCode: item.ItemCode,
            CustomerID,
            tableNo: currentTable,
          })
        ).unwrap();

        if (res?.remainingItems === 0) {
          dispatch(resetCart());
        } else {
          await dispatch(getCartSync()).unwrap();
        }
      }, "cart");
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <div className="mb-4">
      <Card classNames={{ base: "!border-solid !border-gray-800 border-2" }}>
        <CardBody>
          <div className="relative flex flex-row justify-start items-start gap-4">
            <div className="w-24 h-24 overflow-hidden rounded-lg flex items-center justify-center bg-transparent">
              <Image
                src={
                  menuItem?.ItemImage
                    ? `data:image/jpeg;base64,${menuItem.ItemImage}`
                    : no_image_img
                }
                className="w-full h-full object-contain !z-0"
              />
            </div>
            <div className="flex flex-col gap-1 self-center">
              <div className="font-semibold mb-[5px] w-full">
                {item.Description}
              </div>
              <div className="flex mb-[5px] ">
                Amount:&nbsp;
                <div className="font-semibold ">
                  &#8377;{Intl.NumberFormat("en-IN").format(item.MaxRate)}
                </div>
              </div>
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
                <div className="font-semibold mr-[10px] ml-[10px]">{Qty}</div>
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
            </div>
            <div className="absolute right-0 bottom-0 top-0 flex items-center ml-[5px]">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                color="warning"
                radius="full"
                onClick={handleDelItem}
                className="h-full"
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CartCard;
