import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setCustomer } from "../redux/customers/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  getTableList,
  setTable,
  setTableList,
} from "../redux/table/tableSlice";
import { GroupIcon } from "../components/icons/GroupIcon";
import { LogoutIcon } from "../components/icons/LogoutIcon";
import { signOut } from "../redux/auth/authActions";
import { selectCurrentAuth } from "../redux/auth/authSlice";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [newOrderMember, setNewOrderMember] = useState<number>(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [prepCounts, setPrepCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const tables = useSelector(getTableList);
  const { id } = useSelector(selectCurrentAuth);

  const handleCreateViewOrder = async (tableNo: string) => {
    await dispatch(setCustomer({ CustomerID: "1", CustomerName: "CASH BILL" }));
    await dispatch(setTable({ TableNo: tableNo }));
    navigate("/menu");
  };

  const handleSignOut = async () => {
    await dispatch(signOut());
    window.location.reload();
  };

  const handleGuestDetails = async (tableNo: string) => {
    setSelectedTable(tableNo);
    onOpen();
  };

  const handleNewOrderCreate = async () => {
    try {
      await dispatch(
        setTable({
          TableNo: selectedTable,
          GuestCount: newOrderMember,
        })
      );
      await dispatch(
        setCustomer({
          CustomerID: "1",
          CustomerName: "CASH BILL",
        })
      );
      navigate("/menu");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      // Fetch tables
      const tablesResponse = await axios.get(
        `${backendURL}/api/v1/table/getTables`,
        { withCredentials: true }
      );
      await dispatch(setTableList(tablesResponse.data));

      // Fetch prep counts
      const prepResponse = await axios.get(
        `${backendURL}/api/v1/order/prepItemData`,
        { withCredentials: true }
      );
      const counts = prepResponse.data.reduce(
        (
          acc: Record<string, number>,
          item: { TableNo: string; PreparedCount: number }
        ) => {
          acc[item.TableNo] = item.PreparedCount;
          return acc;
        },
        {}
      );
      setPrepCounts(counts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [dispatch, fetchData]);

  // Set up polling interval
  useEffect(() => {
    const intervalId = setInterval(fetchData, 30000); // 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, fetchData]);

  const filteredTables = tables.filter(
    (table) =>
      !table.TableStatus || // Show all available tables
      (table.TableStatus === "Active" && table.WaiterName === id) // Show active tables for current waiter
  );

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="w-10"></div>
          <h2 className="text-xl font-bold flex-1 text-center">Tables</h2>
          <Button className="w-10" onPress={() => handleSignOut()} isIconOnly>
            <LogoutIcon />
          </Button>
        </div>
        <Divider className="mb-3" />
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2">
          {filteredTables.map((table) => (
            <Card
              key={table.TableNo}
              isPressable
              className={`aspect-square transition-transform hover:scale-105 ${
                table.TableStatus === "Active"
                  ? "bg-warning-300"
                  : "bg-gray-200"
              }`}
              onClick={
                !table.TableStatus
                  ? () => handleGuestDetails(table.TableNo)
                  : () => handleCreateViewOrder(table.TableNo)
              }
            >
              {prepCounts[table.TableNo] > 0 && (
                <div className="absolute top-2 right-2">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    {prepCounts[table.TableNo]}
                  </div>
                </div>
              )}
              <CardBody className="flex flex-col items-center justify-center p-0 text-black">
                <div className="font-bold text-lg">{table.TableNo}</div>
              </CardBody>
              <CardFooter className="text-black flex justify-center items-center">
                {table.TableStatus ? (
                  <>
                    <div className="flex flex-row items-center justify-center gap-1 mt-1">
                      <GroupIcon color="black" />
                      <div className="font-semibold mt-1">
                        {table.NoOfGuests}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm font-medium mt-2">
                    {table.TableStatus || "Available"}
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom"
        className="text-white bg-gray-800"
      >
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex items-center justify-center gap-1">
                Guest Info
                <label className="font-semibold text-warning">
                  {selectedTable}
                </label>
              </DrawerHeader>
              <DrawerBody className="flex flex-row items-center justify-between gap-4">
                <div>No. of Guests: </div>
                <span className="font-semibold">{newOrderMember}</span>
                <div className="flex flex-row items-center gap-2">
                  <Button
                    variant="ghost"
                    color="primary"
                    className="!text-large"
                    onClick={() => {
                      if (newOrderMember - 1 >= 1) {
                        setNewOrderMember(newOrderMember - 1);
                      }
                    }}
                  >
                    -
                  </Button>
                  <Button
                    variant="ghost"
                    color="primary"
                    onClick={() => setNewOrderMember(newOrderMember + 1)}
                  >
                    +
                  </Button>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button
                  color="primary"
                  fullWidth
                  onPress={() => handleNewOrderCreate()}
                >
                  Create Order
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Home;
