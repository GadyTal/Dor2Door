import { useContext } from "react";
import { ModalContext } from "../core/ModalRenderer";

export const useModalNavigation = () => {
  const modalNavigator = useContext(ModalContext);
  return modalNavigator;
};
