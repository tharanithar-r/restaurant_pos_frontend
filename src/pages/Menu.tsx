import { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchCategories, fetchItems } from "../redux/menu/menuActions";
import ItemCard from "../components/ui/ItemCard";
import { Divider } from "@nextui-org/react";
import { setSearchquery } from "../redux/searchSlice";
import CategoryCard from "../components/ui/CategoryCard";
import { getCurrentTable } from "../redux/table/tableSlice";
import { useNavigate } from "react-router-dom";
import { getCartSync } from "../redux/cart/cartAction";
import { setSelectedCategory } from "../redux/menu/menuSlice";

const Menu = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, items, selectedCategory, status } = useSelector(
    (state: RootState) => state.menu
  );
  const searchQuery = useSelector(
    (state: RootState) => state.search.searchQuery
  );

  const currentTable = useSelector(getCurrentTable);

  useEffect(() => {
    if (!currentTable) {
      navigate("/home");
      return;
    }
    dispatch(fetchCategories());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTable, navigate]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchItems(selectedCategory));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  useEffect(() => {
    dispatch(getCartSync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategorySelect = useCallback(
    (category: string) => {
      dispatch(setSearchquery(""));
      dispatch(setSelectedCategory(category));
    },
    [dispatch]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.Description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="flex overflow-x-auto gap-3 my-2 ">
        {categories.map((category) => (
          <CategoryCard
            key={category.Category}
            category={category}
            isSelected={selectedCategory === category.Category}
            onSelect={handleCategorySelect}
          />
        ))}
      </div>
      <Divider />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-[20px]">
        {filteredItems.map((item) => (
          <ItemCard key={item.ItemCode} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
