import { Spinner } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const LoadingIndicator: React.FC = () => {
  const { isLoading } = useSelector((state: RootState) => state.loading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-[9999]">
      <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
        <Spinner color="warning" size="lg" />
      </div>
    </div>
  );
};

export default LoadingIndicator;
