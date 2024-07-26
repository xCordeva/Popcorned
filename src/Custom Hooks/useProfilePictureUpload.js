import { useState, useRef } from "react";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "@/firebase/firebase";

const useProfilePictureUpload = (user) => {
  const [profilePicture, setProfilePicture] = useState(
    "https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/no-image-avaiable.jpg?alt=media&token=f01f2f4a-c8db-4e5f-8f7f-c920219a77fd"
  );
  const [showSelectImageAlert, setShowSelectImageAlert] = useState(false);
  const [showImageUpdatedSuccessfully, setShowImageUpdatedSuccessfully] =
    useState(false);
  const [pictureUploading, setPictureUploading] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[0];
      if (fileType !== "image") {
        setShowSelectImageAlert(true);
        return;
      }
      handleImageUpload(file);
    }
  };

  const handleImageUpload = (file) => {
    if (!file) {
      return;
    }
    const imageRef = storageRef(storage, `profile-pictures/${user.uid}`);

    setPictureUploading(true);
    uploadBytes(imageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            updateProfilePicture(url);
            saveProfilePictureUrlToDatabase(url);
          })
          .catch((error) => {
            console.error(error.message);
          });
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const updateProfilePicture = (url) => {
    updateProfile(auth.currentUser, { photoURL: url })
      .then(() => {
        setProfilePicture(url);
        setShowSelectImageAlert(false);
        setPictureUploading(false);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const saveProfilePictureUrlToDatabase = async (url) => {
    try {
      await setDoc(doc(db, "users", user.uid), { photoURL: url }).then(() => {
        setShowImageUpdatedSuccessfully(true);
        setTimeout(() => {
          setShowImageUpdatedSuccessfully(false);
        }, 4000);
      });
    } catch (error) {
      console.error("Error saving profile picture URL to database: ", error);
    }
  };

  return {
    profilePicture,
    showSelectImageAlert,
    showImageUpdatedSuccessfully,
    pictureUploading,
    fileInputRef,
    handleFileInputChange,
  };
};

export default useProfilePictureUpload;
