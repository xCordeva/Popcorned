"use client";
import useAuth from "@/Custom Hooks/useAuth";
import Navbar from "../components/Navbar";
import "@/css/ProfilePage.css";
import { useRef, useState } from "react";
import usePopupCloser from "@/Custom Hooks/usePopupCloser";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {
  faCircleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProfilePage() {
  usePopupCloser();
  const { user } = useAuth();
  const [isAddingNewEmail, setIsAddingNewEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(
    "https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/no-image-avaiable.jpg?alt=media&token=f01f2f4a-c8db-4e5f-8f7f-c920219a77fd"
  );
  const fileInputRef = useRef(null);

  const handleAddNewEmail = () => {
    setIsAddingNewEmail(true);
  };

  const handleUpdateEmail = () => {
    console.log("Updating email to:", newEmail);
  };

  const handleUpdatePassword = () => {
    if (newPassword === confirmNewPassword) {
      console.log("Updating password to:", newPassword);
    } else {
      console.error("Passwords do not match");
    }
  };
  const [showSelectImageAlert, setShowSelectImageAlert] = useState(false);
  const [showImageUpdatedSuccessfully, setShowImageUpdatedSuccessfully] =
    useState(false);
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

  const storage = getStorage();
  const db = getFirestore();
  const auth = getAuth();

  const [pictureUploading, setPictureUploading] = useState(false);
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
    updateProfile(auth.currentUser, {
      photoURL: url,
    })
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
      await setDoc(doc(db, "users", user.uid), {
        photoURL: url,
      }).then(() => {
        setShowImageUpdatedSuccessfully(true);
        setTimeout(() => {
          setShowImageUpdatedSuccessfully(false);
        }, 4000);
      });
    } catch (error) {
      console.error("Error saving profile picture URL to database: ", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="profile-settings-page">
        <h1>Account Settings</h1>
        <div className="profile-settings">
          <div className="profile-picture">
            {pictureUploading ? (
              <div className="image-container">
                <img
                  className="image-uploading"
                  src={`https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/loading.gif?alt=media&token=fb93d855-3412-4e08-bf85-a696cc68004a`}
                  alt="Loading..."
                />
              </div>
            ) : (
              <div className="image-container">
                <img
                  className="profile-picture"
                  src={user?.photoURL || profilePicture}
                  alt="user-profile-picture"
                />{" "}
              </div>
            )}

            <label className="choose-image-button">
              Choose Image
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </label>
            <div className="image-text-container">
              <p
                className="select-image-alert"
                style={{
                  display: showSelectImageAlert ? "flex" : "none",
                }}
              >
                <FontAwesomeIcon icon={faCircleExclamation} />
                Please select a valid image file
              </p>
            </div>
            <div className="image-text-container">
              <p
                className="image-updated"
                style={{
                  display: showImageUpdatedSuccessfully ? "flex" : "none",
                }}
              >
                <FontAwesomeIcon icon={faCircleCheck} />
                Profile picture updated successfully!
              </p>
            </div>
          </div>
          <div className="divider"></div>
          <div className="user-info">
            <label htmlFor="name">Display Name:</label>
            <input
              type="text"
              value={user ? user.displayName : "User Name"}
              disabled
            />

            <label htmlFor="email">Email:</label>
            <div className="email-group">
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={user ? user.email : ""}
                disabled
              />
              {user && !user.emailVerified ? (
                <p className="verification-status">
                  Not Verified{" "}
                  <span
                    className="send-verfication"
                    onClick={() => handleSendVerification(user.email)}
                  >
                    Send Verification
                  </span>
                </p>
              ) : (
                <p className="verification-status">Verified</p>
              )}
            </div>
            <div className="button-container">
              <button
                onClick={handleAddNewEmail}
                className={`update-button ${
                  isAddingNewEmail ? "hide-update-button" : ""
                }`}
              >
                Add New Email
              </button>
            </div>

            <input
              className={`new-email-group ${
                isAddingNewEmail ? "show-email-group" : ""
              }`}
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <button
              onClick={handleUpdateEmail}
              className={`update-email-button ${
                isAddingNewEmail ? "show-update-email-button" : ""
              }`}
            >
              Update Email
            </button>

            <label htmlFor="current-password">Current Password:</label>
            <input
              id="current-password"
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <label htmlFor="new-password">New Password:</label>
            <input
              id="new-password"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label htmlFor="confirm-new-password">Confirm New Password:</label>
            <input
              id="confirm-new-password"
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            <button onClick={handleUpdatePassword} className="update-button">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
