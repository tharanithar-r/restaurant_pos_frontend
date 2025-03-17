import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Key, useAsyncList } from "react-stately";
import axios from "axios";
import { useEffect, useRef } from "react";

const backendURL = import.meta.env.VITE_BACKEND_URL;

type UserType = {
  Uname: string;
};

type UserAutocompleteProps = {
  onUserSelect: (user: string | null) => void;
};

const UserAutocomplete = ({ onUserSelect }: UserAutocompleteProps) => {
  const initialLoad = useRef(true);

  const userslist = useAsyncList<UserType>({
    async load({ signal, filterText }) {
      try {
        const res = await axios.get(
          `${backendURL}/api/v1/user/all${
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
        console.error("Error fetching users:", error);
        return { items: [] };
      }
    },
  });

  useEffect(() => {
    if (initialLoad.current) {
      userslist.reload();
      initialLoad.current = false;
    }
  }, [userslist]);

  const handleSelection = (key: Key | null) => {
    const selectedUser = userslist.items.find((item) => item.Uname === key);
    if (selectedUser) {
      onUserSelect(selectedUser.Uname);
    } else {
      onUserSelect(null);
    }
  };

  return (
    <div className="w-full">
      <Autocomplete
        name="user"
        inputValue={userslist.filterText}
        isLoading={userslist.isLoading}
        items={userslist.items}
        placeholder={"Type to search..."}
        variant="bordered"
        onInputChange={userslist.setFilterText}
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
        {(user) => (
          <AutocompleteItem key={user.Uname} className="capitalize">
            {user.Uname}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
};

export default UserAutocomplete;
