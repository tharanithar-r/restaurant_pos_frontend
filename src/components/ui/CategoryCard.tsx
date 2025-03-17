import { memo } from "react";
import { Card, CardBody } from "@nextui-org/react";

interface CategoryCardProps {
  category: { Category: string };
  isSelected: boolean;
  onSelect: (category: string) => void;
}

const CategoryCard = memo(
  ({ category, isSelected, onSelect }: CategoryCardProps) => (
    <Card
      isPressable
      className={`flex items-center justify-center min-w-fit text-sm font-medium  ${
        isSelected ? "!border-solid border-2 !border-primary text-primary" : ""
      }`}
      onPress={() => onSelect(category.Category)}
    >
      <CardBody>{category.Category}</CardBody>
    </Card>
  )
);

export default CategoryCard;
