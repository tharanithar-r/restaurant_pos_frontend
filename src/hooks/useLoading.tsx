import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setStateLoading, clearStateLoading } from "../redux/loadingSlice";
import { useScrollPosition } from "./useScrollPosition";

export const useLoadingAction = () => {
  const dispatch = useDispatch();
  const { saveScrollPosition, restoreScrollPosition } = useScrollPosition();

  const withLoading = useCallback(
    async <T,>(action: () => Promise<T>, stateName: string): Promise<T> => {
      try {
        saveScrollPosition();
        dispatch(setStateLoading(stateName));
        const result = await action();
        requestAnimationFrame(() => {
          dispatch(clearStateLoading(stateName));
          restoreScrollPosition();
        });
        return result;
      } catch (error) {
        console.error("Action failed:", error);
        dispatch(clearStateLoading(stateName));
        throw error;
      }
    },
    [dispatch, saveScrollPosition, restoreScrollPosition]
  );

  return { withLoading };
};
