import { Button, Tab, Tabs } from "@nextui-org/react";
import { InputOtp } from "@nextui-org/input-otp";
import { Form } from "@nextui-org/form";
import { useState } from "react";
import { signIn } from "../redux/auth/authActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import WaiterAutocomplete from "../components/ui/WaiterAutoComplete";
import { Key } from "@react-types/shared";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState<string | null>(null);
  const [mpin, setMpin] = useState("");
  const [role, setRole] = useState<"kitchen" | "waiter">("waiter");
  const [error, setError] = useState({});
  //const navigate = useNavigate();

  const handleRoleChange = (key: Key) => {
    const newRole = key as "kitchen" | "waiter";
    setRole(newRole);
    if (newRole === "kitchen") {
      setUsername("Kitchen");
    } else {
      setUsername(null);
    }
    setError({});
  };

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (role === "waiter") {
      if (!data.waiter) {
        setError({ waiter: "Please select a waiter" });
        return;
      }
    }
    if (!data.mpin) {
      setError({ mpin: "Please enter you MPin" });
      return;
    }

    try {
      if (username) {
        console.log("username", username);
        let isLogged;
        if (role === "kitchen") {
          isLogged = await dispatch(signIn("Kitchen", mpin, role));
        } else {
          isLogged = await dispatch(signIn(username, mpin, role));
        }
        if (isLogged) {
          if (role === "kitchen") {
            window.location.href = "/kitchen";
          } else {
            window.location.href = "/home";
          }
        }
      } else {
        console.error("No user selected");
      }
    } catch (err) {
      console.error("Sign-in failed: ", err);
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center">
      <div className="my-auto mx-6 sm:mx-12 md:mx-28 lg:mx-36 xl:mx-56">
        <Form
          className="flex items-center"
          onSubmit={handleSignin}
          validationErrors={error}
        >
          <Tabs
            aria-label="Role"
            className="mb-5"
            color="warning"
            selectedKey={role}
            onSelectionChange={handleRoleChange}
            fullWidth
          >
            <Tab key="kitchen" title="Kitchen"></Tab>
            <Tab key="waiter" title="Waiter"></Tab>
          </Tabs>
          {role === "waiter" && (
            <WaiterAutocomplete onWaiterSelect={setUsername} />
          )}
          <div className="flex self-center mt-3">
            <InputOtp
              isRequired
              name="mpin"
              length={4}
              value={mpin}
              onValueChange={setMpin}
              type="password"
              size="lg"
              classNames={{
                passwordChar: "!text-warning",
              }}
            />
          </div>
          <Button
            className="mt-5 !w-full"
            color="warning"
            radius="full"
            type="submit"
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
