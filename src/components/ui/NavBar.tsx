import React from "react";
import { NavLink } from "react-router-dom";
import "../../assets/css/navbar_style.css";
import { CartIcon } from "../icons/CartIcon";
import { MenuIcon } from "../icons/MenuIcon";
import { Badge } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getCartItemCount } from "../../redux/cart/cartSlice";
import { OrderIcon } from "../icons/OrderIcon";

const Navbar: React.FC = () => {
  //   const [isListExpanded, setIsListExpanded] = useState(false);

  //   const toggleExpandList = () => {
  //     setIsListExpanded(!isListExpanded);
  //   };
  const cartCount = useSelector((state: RootState) => getCartItemCount(state));

  return (
    <nav className="nav">
      <ul className="nav__list">
        <li>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              isActive ? "nav__link active_link" : "nav__link"
            }
          >
            <div className="nav__item">
              <i>
                <MenuIcon />
              </i>
              <span className=" text-small">Menu</span>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "nav__link active_link" : "nav__link"
            }
          >
            <Badge content={cartCount} color="warning">
              <div className="nav__item">
                <i>
                  <CartIcon />
                </i>
                <span className=" text-small">Cart</span>
              </div>
            </Badge>
          </NavLink>
        </li>
        {/* <li>
          <button className="nav__expand" onClick={toggleExpandList}>
            <i
              className={`ri-add-line nav__expand-icon ${
                isListExpanded ? "rotate-icon" : ""
              }`}
            ></i>
          </button>
          <ul
            className={`nav__expand-list ${isListExpanded ? "show-list" : ""}`}
          >
            <li>
              <NavLink to="/gallery" className="nav__expand-link">
                <i className="ri-image-2-line"></i>
                <span>Gallery</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/files" className="nav__expand-link">
                <i className="ri-archive-line"></i>
                <span>Files</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/saved" className="nav__expand-link">
                <i className="ri-bookmark-3-line"></i>
                <span>Saved</span>
              </NavLink>
            </li>
          </ul>
        </li> */}
        <li>
          <NavLink
            to="/order"
            className={({ isActive }) =>
              isActive ? "nav__link active_link" : "nav__link"
            }
          >
            <div className="nav__item">
              <i>
                <OrderIcon />
              </i>
              <span className=" text-small">Orders</span>
            </div>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
