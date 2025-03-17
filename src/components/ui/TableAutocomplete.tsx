import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Key, useAsyncList } from "react-stately";
import axios from "axios";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setTable } from "../../redux/table/tableSlice";

const backendURL = import.meta.env.VITE_BACKEND_URL;

type TableType = {
  TableNo: string;
};

const TableAutocomplete = () => {
  const initialLoad = useRef(true);
  const dispatch = useDispatch();

  const tableslist = useAsyncList<TableType>({
    async load({ signal, filterText }) {
      try {
        const res = await axios.get(
          `${backendURL}/api/v1/menu/tablesactive${
            filterText ? `?name=${filterText}` : ""
          }`,
          { withCredentials: true, signal }
        );
        const json = await res.data;
        console.log("json", json);

        return {
          items: Array.isArray(json) ? json : [],
        };
      } catch (error) {
        console.error("Error fetching tables:", error);
        return { items: [] };
      }
    },
  });

  useEffect(() => {
    if (initialLoad.current) {
      tableslist.reload();
      initialLoad.current = false;
    }
  }, [tableslist]);

  const handleSelection = useCallback(
    (key: Key | null) => {
      const selectedTable = tableslist.items.find(
        (table) => table.TableNo === key
      );
      if (selectedTable) {
        dispatch(
          setTable({
            TableNo: selectedTable.TableNo,
          })
        );
      } else {
        dispatch(setTable(null));
      }
    },
    [tableslist.items, dispatch]
  );

  return (
    <div className="w-full">
      <Autocomplete
        name="user"
        inputValue={tableslist.filterText}
        isLoading={tableslist.isLoading}
        items={tableslist.items}
        placeholder={"Type to search..."}
        variant="bordered"
        onInputChange={tableslist.setFilterText}
        onSelectionChange={handleSelection}
        label="Select Table"
        labelPlacement="outside"
        radius="md"
        aria-label="Table"
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
        {(table) => (
          <AutocompleteItem key={table.TableNo} className="capitalize">
            {table.TableNo}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
};

export default TableAutocomplete;
