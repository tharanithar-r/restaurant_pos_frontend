import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Key, useAsyncList } from "react-stately";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setCustomer } from "../../redux/customers/customerSlice";

const backendURL = import.meta.env.VITE_BACKEND_URL;

type CustomerType = {
  Customer: string;
  CustomerName: string;
};

const CustomerAutocomplete = () => {
  const initialLoad = useRef(true);
  const dispatch = useDispatch();
  const [defaultKey, setDefaultKey] = useState<Key>("1");
  const [inputValue, setInputValue] = useState<string>("");

  const customerslist = useAsyncList<CustomerType>({
    async load({ signal, filterText }) {
      try {
        const res = await axios.get(
          `${backendURL}/api/v1/customer${
            filterText ? `?name=${filterText}` : ""
          }`,
          { withCredentials: true, signal }
        );
        const json = await res.data;

        return {
          items: Array.isArray(json) ? json : [],
        };
      } catch (error) {
        console.error("Error fetching customers:", error);
        return { items: [] };
      }
    },
  });

  const handleSelection = useCallback(
    (key: Key | null) => {
      const selectedCustomer = customerslist.items.find(
        (item) => item.Customer === key
      );
      if (selectedCustomer) {
        dispatch(
          setCustomer({
            CustomerID: selectedCustomer.Customer,
            CustomerName: selectedCustomer.CustomerName,
          })
        );
      } else {
        dispatch(setCustomer(null));
      }
    },
    [customerslist.items, dispatch]
  );

  useEffect(() => {
    if (initialLoad.current && customerslist.items.length > 0) {
      const defaultCustomer = customerslist.items.find(
        (item) => item.Customer === "1"
      );
      if (defaultCustomer) {
        handleSelection("1");
        setDefaultKey("1");
        setInputValue(defaultCustomer.CustomerName);
      }
      initialLoad.current = false;
    }
  }, [customerslist.items, handleSelection]);

  return (
    <div className="w-full">
      <Autocomplete
        name="user"
        value={inputValue}
        isLoading={customerslist.isLoading}
        items={customerslist.items}
        placeholder={"Type to search..."}
        defaultSelectedKey={defaultKey}
        label="Customer Name"
        labelPlacement="outside"
        variant="bordered"
        onInputChange={(value) => {
          setInputValue(value);
          customerslist.setFilterText(value);
        }}
        onSelectionChange={handleSelection}
        radius="md"
        aria-label="User"
        classNames={{ selectorButton: "text-black", clearButton: "text-black" }}
        inputProps={{
          classNames: {
            inputWrapper: "bg-white",
            innerWrapper: "text-black",
            mainWrapper: "w-full",
            input: ["placeholder:text-black"],
          },
        }}
        listboxProps={{
          classNames: {
            base: "text-black",
          },
        }}
      >
        {(customer) => (
          <AutocompleteItem key={customer.Customer} className="capitalize">
            {customer.CustomerName}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
};

export default CustomerAutocomplete;
