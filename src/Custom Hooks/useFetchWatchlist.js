import { useState, useEffect } from "react";
import { auth, db } from "@/firebase/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";

const useFetchWatchlist = () => {
  // a Redux state to refresh the fetch
  const refetchWatchlist = useSelector((state) => state.RefetchWatchlist.value);

  const [watchlist, setWatchlist] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserId = async () => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        const uid = user?.uid || null;
        setUserId(uid);
        resolve(uid);
        console.log(uid);
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const uid = await getUserId();
      if (!uid) {
        setIsLoading(false);
        return;
      }

      const q = query(
        collection(db, "watchlist"),
        where("userId", "==", uid)
        // orderBy("highPriority", "desc")
      );
      const querySnapshot = await getDocs(q);
      const watchlistData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWatchlist(watchlistData);
      setIsLoading(false);
    };

    fetchData();
  }, [refetchWatchlist]);

  const addToWatchlist = async (newWatchlistItem, type, topCast) => {
    const uid = await getUserId();
    if (!uid) {
      return;
    }

    const docRef = collection(db, `users/${uid}/watchlist`);
    addDoc(docRef, { ...newWatchlistItem, type, topCast, userId: uid });
  };

  // const editEvent = async (editedEventData, eId) => {
  //   const uid = await getUserId();
  //   if (!uid) {
  //     return;
  //   }
  //   const docRef = doc(db, "events", eId);
  //   setDoc(docRef, { ...editedEventData, userId: uid });
  // };
  // const deleteEvent = async (eId) => {
  //   const uid = await getUserId();
  //   if (!uid) {
  //     return;
  //   }
  //   deleteDoc(doc(db, "events", eId));
  // };

  return { watchlist, addToWatchlist, isLoading };
};

export default useFetchWatchlist;
