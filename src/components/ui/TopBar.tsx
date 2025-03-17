import { Button, Chip, Input } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeIcon } from "../icons/HomeIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentTable,
  getCurrentTableGuestCount,
} from "../../redux/table/tableSlice";
import { SearchIcon } from "../icons/SearchIcon";
import { RootState } from "../../redux/store";
import { setSearchquery } from "../../redux/searchSlice";
import { GroupIcon } from "../icons/GroupIcon";

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableNo = useSelector(getCurrentTable);
  const guestCount = useSelector(getCurrentTableGuestCount);
  const searchQuery = useSelector(
    (state: RootState) => state.search.searchQuery
  );

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case "/cart":
        return "Cart";
      case "/menu":
        return "Menu";
      case "/order":
        return "Order";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 shadow-sm text-white backdrop-blur">
        <div className="flex items-center justify-between px-4 h-16 relative">
          <div className="w-[40px]">
            {location.pathname !== "/" && (
              <Button
                isIconOnly
                variant="faded"
                color="warning"
                onClick={() => navigate("/home")}
              >
                <HomeIcon color="#f9791f" />
              </Button>
            )}
          </div>

          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-xl font-semibold whitespace-nowrap">
              {getPageTitle(location.pathname)}
            </h1>
          </div>

          <div className="w-[120px] flex justify-end">
            <Chip color="warning" variant="faded">
              <div className="flex items-center space-x-2">
                <span>{tableNo}</span>
                <span className="text-gray-400 text-sm">•</span>
                <div className="flex items-center">
                  <GroupIcon height={16} width={16} color="#f9791f" />
                  <span className="ml-1">{guestCount || "0"}</span>
                </div>
              </div>
            </Chip>
          </div>
        </div>

        {location.pathname === "/menu" && (
          <div className="px-4 py-2 backdrop-blur">
            <Input
              className="w-full"
              placeholder="Search items..."
              size="lg"
              startContent={<SearchIcon />}
              value={searchQuery}
              onChange={(e) => dispatch(setSearchquery(e.target.value))}
              isClearable
              onClear={() => dispatch(setSearchquery(""))}
            />
          </div>
        )}
      </div>
      {location.pathname === "/menu" && <div className="h-[76px]"></div>}
    </>
  );
};

export default TopBar;
