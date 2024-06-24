import { useState, useEffect } from "react";
import { auth, db } from "@/firebase/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useSelector } from "react-redux";

const useFetchWatchlist = () => {
  // a Redux state to refresh the fetch
  const refetchWatchlist = useSelector((state) => state.RefetchWatchlist.value);

  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserId = async () => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        const uid = user?.uid || null;
        resolve(uid);
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

      const watchlistRef = query(
        collection(db, `users/${uid}/watchlist`),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(watchlistRef);
      const watchlistData = querySnapshot.docs.map((doc) => ({
        firebaseItemId: doc.id,
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
    addDoc(docRef, {
      ...newWatchlistItem,
      type,
      topCast,
      userId: uid,
      createdAt: serverTimestamp(),
    });
  };

  const removeFromWatchlist = async (itemId) => {
    const uid = await getUserId();
    if (!uid) {
      return;
    }
    deleteDoc(doc(db, `users/${uid}/watchlist`, itemId));
  };

  return { watchlist, addToWatchlist, removeFromWatchlist, isLoading };
};

export default useFetchWatchlist;
