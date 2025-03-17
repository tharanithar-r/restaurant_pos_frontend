import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  fetchAllKitchenOrders,
  prepareItem,
} from "../redux/kitchen/kitchenActions";
import { getAllKitchenOrders } from "../redux/kitchen/kitchenSlice";
import { CheckIcon } from "../components/icons/CheckIcon";
import { LogoutIcon } from "../components/icons/LogoutIcon";
import { signOut } from "../redux/auth/authActions";

const Kitchen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selected, setSelected] = useState("pending");
  const kitchenOrders = useSelector(getAllKitchenOrders);
  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchAllKitchenOrders());
    }

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(fetchAllKitchenOrders());
    }, 30000); // 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);

  const sortedOrders = useMemo(() => {
    return [...kitchenOrders].sort((a, b) => {
      // First sort by OrderNO
      const orderNoCompare = Number(b.OrderNO) - Number(a.OrderNO);
      if (orderNoCompare !== 0) return orderNoCompare;

      // Then by OrderDate if OrderNO is same
      return new Date(b.OrderDate).getTime() - new Date(a.OrderDate).getTime();
    });
  }, [kitchenOrders]);

  // Group orders by OrderNO after sorting
  const groupedOrders = useMemo(() => {
    return sortedOrders.reduce((acc, order) => {
      if (!acc[order.OrderNO]) {
        acc[order.OrderNO] = [];
      }
      acc[order.OrderNO].push(order);
      return acc;
    }, {} as Record<string, typeof sortedOrders>);
  }, [sortedOrders]);

  const isOrderPrepared = useCallback((orders: typeof sortedOrders) => {
    return orders.every((order) => order.Status !== "Order");
  }, []);

  const filteredOrders = useMemo(() => {
    const orders = Object.entries(groupedOrders).filter(([, orders]) => {
      const isPrepared = isOrderPrepared(orders);
      return selected === "pending" ? !isPrepared : isPrepared;
    });
    return Object.fromEntries(orders);
  }, [groupedOrders, selected, isOrderPrepared]);

  const pendingOrdersCount = useMemo(() => {
    return Object.values(groupedOrders).filter(
      (orders) => !isOrderPrepared(orders)
    ).length;
  }, [groupedOrders, isOrderPrepared]);

  const handlePrepItem = async (
    orderNo: string,
    tableNo: string,
    sNo: number,
    ItemCode: string
  ) => {
    await dispatch(prepareItem({ orderNo, tableNo, sNo, ItemCode }));
    await dispatch(fetchAllKitchenOrders());
  };

  const handleSignOut = async () => {
    await dispatch(signOut());
    window.location.reload();
  };

  return (
    <>
      <div className="flex w-full justify-between items-center px-4 pt-5">
        <div className="w-10"></div>
        <Tabs
          aria-label="Options"
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key.toString())}
          size="md"
        >
          <Tab
            key="pending"
            title={
              <div className="flex items-center gap-2">
                <span>Pending</span>
                {pendingOrdersCount > 0 && (
                  <Chip size="sm" variant="flat" color="danger">
                    {pendingOrdersCount}
                  </Chip>
                )}
              </div>
            }
          ></Tab>
          <Tab key="completed" title="Completed"></Tab>
        </Tabs>
        <Button className="w-10" onPress={() => handleSignOut()} isIconOnly>
          <LogoutIcon />
        </Button>
      </div>
      <div className="h-[calc(100vh-64px)] overflow-hidden">
        {Object.keys(filteredOrders).length > 0 ? (
          <div className="h-full overflow-x-auto">
            <div className="inline-flex gap-4 p-4 min-w-full lg:min-w-0">
              {Object.entries(filteredOrders).map(([orderNo, orders]) => (
                <Card
                  key={orderNo}
                  className="w-[calc(100vw-32px)] sm:w-[450px] h-[calc(100vh-96px)]"
                >
                  <CardHeader className="flex justify-between items-center sticky top-0 bg-warning backdrop-blur-md z-10">
                    <div className="flex flex-col gap-2 items-center">
                      <span className="text-lg font-bold">
                        Table {orders[0].TableNo}
                      </span>
                      <Chip color="primary" size="sm">
                        Order #{orderNo}
                      </Chip>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                      <Chip color="primary" size="sm">
                        {isOrderPrepared(orders) ? "Prepared" : "Pending"}
                      </Chip>
                      <span>
                        {new Date(orders[0].OrderDate).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </span>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody className="overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {orders.map((order, index) => (
                        <>
                          <div
                            key={`${order.OrderNO}-${index}`}
                            className={`flex justify-between items-center p-3 rounded-lg ${
                              order.Status !== "Order"
                                ? "bg-success bg-opacity-50"
                                : ""
                            }`}
                          >
                            <div className="flex-1 flex justify-between items-center">
                              <div className="flex-1 flex flex-row gap-3">
                                <span className="font-semibold">
                                  {order.Qty}x
                                </span>
                                <p className="font-semibold">
                                  {order.Description}
                                </p>
                              </div>
                              {order.Status === "Order" && (
                                <div>
                                  <Button
                                    isIconOnly
                                    onPress={() =>
                                      handlePrepItem(
                                        order.OrderNO,
                                        order.TableNo,
                                        order.Sno,
                                        order.ItemCode
                                      )
                                    }
                                  >
                                    <CheckIcon />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <Divider />
                        </>
                      ))}
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button fullWidth>Finish</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-600">
                No {selected === "pending" ? "pending" : "completed"} orders
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Kitchen;
