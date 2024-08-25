import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Update the isAddedMap whenever the watchlist changes
    const initialMap = watchlist.reduce((map, item) => {
      map[item.id] = true;
      return map;
    }, {});
    setIsAddedMap(initialMap);
  }, [watchlist]);

  const handleAddToWatchlist = (result, type, topCast) => {
    const isAdded = isAddedMap[result.id];

    if (!user) {
      dispatch(showSignInMessagePopup(true));
    } else if (!isAdded) {
      addToWatchlist(result, type, topCast).finally(() => {
        setIsAddedMap((prevMap) => ({ ...prevMap, [result.id]: true }));
        dispatch(triggerRefetch(!refetchWatchlist));
      });
    }
  };

  const handleRemoveFromListClick = (event, itemId, resultId) => {
    event.preventDefault();
    if (isAddedMap[resultId]) {
      setIsAddedMap((prevMap) => ({ ...prevMap, [resultId]: false }));
      dispatch(openRemoveWatchlistPopup(itemId));
      dispatch(triggerRefetch(!refetchWatchlist));
    }
  };

  return { handleAddToWatchlist, handleRemoveFromListClick };
};

export default useAddToWatchlist;
