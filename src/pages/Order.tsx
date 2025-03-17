import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  billOrder,
  deleteItem,
  getOrdersSync,
  serveItem,
} from "../redux/orders/orderAction";
import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import { getOrderTotal } from "../redux/orders/orderSlice";
import { CheckIcon } from "../components/icons/CheckIcon";
import { useLoadingAction } from "../hooks/useLoading";
import { TrashIcon } from "../components/icons/TrashIcon";

interface OrderItem {
  OrderNO: string;
  Sno: number;
  Status: string;
  Qty: number;
  ItemCode: string;
  Description: string;
  Amount: number;
}

interface GroupedOrder {
  Description: string;
  ItemCode: string;
  TotalQty: number;
  Amount: number;
  orders: {
    OrderNO: string;
    Sno: number;
    Status: string;
    Qty: number;
  }[];
}

const Order = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orderslist = useSelector((state: RootState) => state.order.orders);
  const orderTotal = useSelector(getOrderTotal);
  const { withLoading } = useLoadingAction();

  useEffect(() => {
    async function fetchData() {
      try {
        await withLoading(async () => {
          await dispatch(getOrdersSync()).unwrap();
        }, "order");
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    }
    fetchData();
  }, [dispatch, withLoading]);

  const handleBillOrder = async () => {
    try {
      await dispatch(billOrder());
      await dispatch(getOrdersSync());
    } catch (error) {
      console.error("Error in handleBillOrder:", error);
    }
  };

  const groupedOrders = useMemo(() => {
    console.log("Grouping orders:", orderslist);
    const grouped = orderslist.reduce((acc, order: OrderItem) => {
      const key = order.ItemCode;
      if (!acc[key]) {
        acc[key] = {
          Description: order.Description,
          ItemCode: order.ItemCode,
          TotalQty: 0,
          Amount: 0,
          orders: [],
        };
      }

      // Keep each order separate
      acc[key].orders.push({
        OrderNO: order.OrderNO,
        Sno: order.Sno,
        Status: order.Status,
        Qty: order.Qty,
      });

      // Update totals
      acc[key].Amount += order.Amount;

      return acc;
    }, {} as Record<string, GroupedOrder>);

    console.log("Grouped orders result:", grouped);
    return grouped;
  }, [orderslist]);

  const handleServeItem = async (ItemCode: string) => {
    try {
      const itemDetails = groupedOrders[ItemCode];
      if (!itemDetails) return;

      // Get all prepared orders
      const preparedOrders = itemDetails.orders.filter(
        (order) => order.Status === "Prepared"
      );

      // Process each order separately
      for (const order of preparedOrders) {
        await dispatch(
          serveItem({
            orderNo: order.OrderNO,
            sNo: order.Sno,
            ItemCode: ItemCode,
          })
        ).unwrap();
      }

      await dispatch(getOrdersSync());
    } catch (error) {
      console.error("Error in handleServeItem:", error);
    }
  };

  const handleDeleteItem = async (orderNO: string, sno: number) => {
    try {
      await dispatch(deleteItem({ orderNo: orderNO, sno })).unwrap();

      await dispatch(getOrdersSync());
    } catch (error) {
      console.error("Error in handleDeleteItem:", error);
    }
  };

  return (
    <>
      {Object.values(groupedOrders).length > 0 ? (
        <>
          <div className="mt-8 px-2 pb-[160px]">
            <Card>
              <CardBody>
                <div className="pb-3">
                  <label className="font-bold">Item's Served:</label>
                </div>
                {Object.values(groupedOrders).map((item) => (
                  <div key={`${item.orders}-${item.ItemCode}`}>
                    {item.orders.map((order) => (
                      <>
                        <div
                          className={`grid grid-cols-4 gap-4 my-1 justify-between items-center p-3 rounded-lg ${
                            order.Status === "Served"
                              ? "bg-success bg-opacity-50"
                              : ""
                          }`}
                        >
                          <div>{item.Description}</div>
                          <div className="text-right">x{order.Qty}</div>
                          <div className="text-right">
                            &#8377;
                            {Intl.NumberFormat("en-IN").format(item.Amount)}
                          </div>
                          {order.Status === "Prepared" ? (
                            <div className="flex justify-end">
                              <Button
                                isIconOnly
                                onPress={() => handleServeItem(item.ItemCode)}
                              >
                                <CheckIcon />
                              </Button>
                            </div>
                          ) : order.Status === "Order" ? (
                            <div className="flex justify-end">
                              <Button
                                isIconOnly
                                onPress={() =>
                                  handleDeleteItem(order.OrderNO, order.Sno)
                                }
                              >
                                <TrashIcon color="#d21404" />
                              </Button>
                            </div>
                          ) : null}
                        </div>
                        <Divider />
                      </>
                    ))}
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
          <div className="fixed bottom-0 left-0 right-0 ml-6 mr-8 mb-[105px]">
            <Card isBlurred className="!bg-gray-200 text-black">
              <CardBody className="">
                <div className="flex justify-between w-full mb-3 p-1 font-semibold">
                  <label>Total: </label>
                  <label className="text-right ">
                    &#8377;{Intl.NumberFormat("en-IN").format(orderTotal)}
                  </label>
                </div>
                <Button
                  fullWidth
                  className="!bg-warning-400 !text-black"
                  radius="full"
                  onPress={() => handleBillOrder()}
                >
                  Print
                </Button>
              </CardBody>
            </Card>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center min-h-screen mt-32">
          <label className="text-center text-base sm:text-base md:text-lg">
            Orders is Empty
          </label>
        </div>
      )}
    </>
  );
};
export default Order;
