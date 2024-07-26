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
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  faCircleExclamation,
  faCircleCheck,
  faCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth, db } from "../../firebase/firebase";

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
  const [emailUpdated, setEmailUpdated] = useState(false);
  const [showInvalidEmailError, setShowInvalidEmailError] = useState(false);
  const [showInvalidPasswordError, setShowInvalidPasswordError] =
    useState(false);
  const [showSelectImageAlert, setShowSelectImageAlert] = useState(false);
  const [showImageUpdatedSuccessfully, setShowImageUpdatedSuccessfully] =
    useState(false);
  const [emailVerficationSent, setEmailVerficationSent] = useState(false);
  const [passwordOfUpdateEmail, setPasswordOfUpdateEmail] = useState("");
  const [pictureUploading, setPictureUploading] = useState(false);

  const fileInputRef = useRef(null);

  const storage = getStorage();

  const handleAddNewEmail = () => {
    setIsAddingNewEmail(true);
  };

  const handleUpdateEmail = async () => {
    const credential = EmailAuthProvider.credential(
      user.email,
      passwordOfUpdateEmail
    );
    try {
      if (user) {
        if (newEmail === "") {
          setShowInvalidEmailError(true);
        } else {
          await reauthenticateWithCredential(user, credential);
          await updateEmail(user, newEmail).then(() => setEmailUpdated(true));
          setShowInvalidPasswordError(false);
          setShowInvalidEmailError(false);
          setIsAddingNewEmail(false);
        }
      }
    } catch (error) {
      console.error("Error updating email: ", error);
      if (error.code === "auth/wrong-password") {
        setShowInvalidPasswordError(true);
        setShowInvalidEmailError(false);
      } else if (error.code === "auth/invalid-email") {
        setShowInvalidEmailError(true);
        setShowInvalidPasswordError(false);
      } else if (error.code === "auth/missing-password") {
        setShowInvalidEmailError(false);
        setShowInvalidPasswordError(true);
      }
    }
  };
  const [passwordNotMatchError, setPasswordNotMatchError] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [showWrongPasswordError, setShowWrongPasswordError] = useState(false);
  const [weakPassword, setWeakPassword] = useState(false);
  const handleUpdatePassword = async () => {
    if (newPassword === confirmNewPassword) {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      try {
        // Reauthenticate the user
        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);
        setPasswordUpdated(true);
        setCurrentPassword("");
        setConfirmNewPassword("");
        setNewPassword("");
        setPasswordNotMatchError(false);
        setWeakPassword(false);
      } catch (error) {
        if (error.code === "auth/wrong-password") {
          setShowWrongPasswordError(true);
        } else if (error.code === "auth/weak-password") {
          setWeakPassword(true);
        } else {
          console.error("Error updating password: ", error);
        }
      }
    } else {
      setPasswordNotMatchError(true);
    }
  };

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

  const handleSendVerification = async () => {
    try {
      await sendEmailVerification(user);
      setEmailVerficationSent(true);
    } catch (error) {
      console.error(error);
      setEmailVerficationSent(false);
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
                />
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
                style={{ display: showSelectImageAlert ? "flex" : "none" }}
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
                  {emailVerficationSent ? (
                    <p className="verfication-sent">
                      Verification Sent <FontAwesomeIcon icon={faCheck} />
                    </p>
                  ) : (
                    <span
                      className="send-verification"
                      onClick={() => handleSendVerification(user.email)}
                    >
                      Send Verification
                    </span>
                  )}
                </p>
              ) : (
                <p className="verification-status">Verified</p>
              )}
            </div>
            <div className="button-container">
              {emailUpdated ? (
                <p className="email-updated">
                  Email Updated <FontAwesomeIcon icon={faCheck} />
                </p>
              ) : (
                <button
                  onClick={handleAddNewEmail}
                  className={`update-button ${
                    isAddingNewEmail ? "hide-update-button" : ""
                  }`}
                >
                  Add New Email
                </button>
              )}
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
            <input
              className={`new-email-group ${
                isAddingNewEmail ? "show-email-group" : ""
              }`}
              type="password"
              placeholder="Enter current password to update email"
              value={passwordOfUpdateEmail}
              onChange={(e) => setPasswordOfUpdateEmail(e.target.value)}
            />
            {showInvalidEmailError && (
              <p className="invalid-input show-invalid-input">
                <FontAwesomeIcon icon={faCircleExclamation} />
                Please enter a valid email address
              </p>
            )}
            {showInvalidPasswordError && (
              <p className="invalid-input show-invalid-input">
                <FontAwesomeIcon icon={faCircleExclamation} />
                The password you entered is incorrect
              </p>
            )}
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
            <button
              onClick={handleUpdatePassword}
              className="update-button"
              disabled={passwordUpdated}
            >
              {passwordUpdated ? `Password Updated` : `Update Password`}
            </button>
            {passwordNotMatchError && (
              <p className="password-no-match">
                <FontAwesomeIcon icon={faCircleXmark} />
                The passwords you entered do not match.
              </p>
            )}
            {passwordUpdated && (
              <p className="password-updated">
                Password Updated Successfully.
                <FontAwesomeIcon icon={faCircleCheck} />
              </p>
            )}
            {showWrongPasswordError && (
              <p className="invalid-input show-invalid-input">
                <FontAwesomeIcon icon={faCircleExclamation} />
                The password you entered is incorrect
              </p>
            )}
            {weakPassword && (
              <p className="invalid-input show-invalid-input">
                <FontAwesomeIcon icon={faCircleExclamation} />
                Password should be at least 6 characters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
