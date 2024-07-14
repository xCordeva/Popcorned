import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { triggerRefetch } from "@/features/RefetchWatchlist";
import { showSignInMessagePopup } from "@/features/SignInMessagePopup";
import useAuth from "@/Custom Hooks/useAuth";
import useFetchWatchlist from "@/Custom Hooks/useFetchWatchlist";
import { openRemoveWatchlistPopup } from "@/features/RemoveWatchlistPopup";

const useAddToWatchlist = () => {
  const { addToWatchlist } = useFetchWatchlist();
  const dispatch = useDispatch();
  const refetchWatchlist = useSelector((state) => state.RefetchWatchlist.value);
  const { user } = useAuth();
  const { watchlist } = useFetchWatchlist();
  const [isAddedMap, setIsAddedMap] = useState({});

  const handleAddToWatchlist = (result, type, topCast) => {
    const watchlistItem = watchlist.find((item) => item.id === result.id);
    const isAdded = isAddedMap[result.id];
    if (!user) {
      dispatch(showSignInMessagePopup(true));
    } else if (!watchlistItem && !isAdded) {
      addToWatchlist(result, type, topCast).finally(() => {
        setIsAddedMap((prevMap) => ({ ...prevMap, [result.id]: true }));

        dispatch(triggerRefetch(!refetchWatchlist));
      });
    }
  };

  const handleRemoveFromListClick = (event, itemId, resultId) => {
    event.preventDefault();
    dispatch(openRemoveWatchlistPopup(itemId));
    setIsAddedMap((prevMap) => ({ ...prevMap, [resultId]: false }));
  };

  return { handleAddToWatchlist, handleRemoveFromListClick };
};

export default useAddToWatchlist;
