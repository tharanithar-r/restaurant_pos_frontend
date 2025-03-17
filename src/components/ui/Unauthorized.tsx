import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
      <p className="mb-6">You do not have permission to view this page.</p>
      <Button color="primary" onPress={handleGoBack}>
        Go Back
      </Button>
    </div>
  );
};

export default Unauthorized;
