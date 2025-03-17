import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Key, useAsyncList } from "react-stately";
import axios from "axios";
import { useEffect, useRef } from "react";

const backendURL = import.meta.env.VITE_BACKEND_URL;

type WaiterType = {
  WaiterName: string;
};

type WaiterAutocompleteProps = {
  onWaiterSelect: (waiter: string | null) => void;
};

const WaiterAutocomplete = ({ onWaiterSelect }: WaiterAutocompleteProps) => {
  const initialLoad = useRef(true);

  const waiterslist = useAsyncList<WaiterType>({
    async load({ signal, filterText }) {
      try {
        const res = await axios.get(
          `${backendURL}/api/v1/waiter/all${
            filterText ? `?name=${filterText}` : ""
          }`,
          { signal }
        );
        const json = await res.data;
        console.log("json", json);

        return {
          items: Array.isArray(json) ? json : [],
        };
      } catch (error) {
        console.error("Error fetching waiters:", error);
        return { items: [] };
      }
    },
  });

  useEffect(() => {
    if (initialLoad.current) {
      waiterslist.reload();
      initialLoad.current = false;
    }
  }, [waiterslist]);

  const handleSelection = (key: Key | null) => {
    const selectedWaiter = waiterslist.items.find(
      (item) => item.WaiterName === key
    );
    if (selectedWaiter) {
      onWaiterSelect(selectedWaiter.WaiterName);
    } else {
      onWaiterSelect(null);
    }
  };

  return (
    <div className="w-full">
      <Autocomplete
        name="waiter"
        inputValue={waiterslist.filterText}
        isLoading={waiterslist.isLoading}
        items={waiterslist.items}
        placeholder={"Select your name..."}
        size="lg"
        variant="bordered"
        onInputChange={waiterslist.setFilterText}
        onSelectionChange={handleSelection}
        radius="md"
        aria-label="Waiter"
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
        {(waiter) => (
          <AutocompleteItem key={waiter.WaiterName} className="capitalize">
            {waiter.WaiterName}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
};

export default WaiterAutocomplete;
