"use client";
import useAuth from "@/Custom Hooks/useAuth";
import Navbar from "../components/Navbar";
import "@/css/ProfilePage.css";
import usePopupCloser from "@/Custom Hooks/usePopupCloser";
import {
  faCircleExclamation,
  faCircleCheck,
  faCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useEmailUpdate from "@/Custom Hooks/useEmailUpdate";
import usePasswordUpdate from "@/Custom Hooks/usePasswordUpdate";
import useProfilePictureUpload from "@/Custom Hooks/useProfilePictureUpload";

export default function ProfilePage() {
  usePopupCloser();
  const { user } = useAuth();

  const {
    profilePicture,
    showSelectImageAlert,
    showImageUpdatedSuccessfully,
    pictureUploading,
    initialLoading,
    fileInputRef,
    handleFileInputChange,
  } = useProfilePictureUpload(user);

  const {
    isAddingNewEmail,
    newEmail,
    passwordOfUpdateEmail,
    emailUpdated,
    showInvalidEmailError,
    showInvalidPasswordError,
    emailVerficationSent,
    setNewEmail,
    setPasswordOfUpdateEmail,
    setIsAddingNewEmail,
    handleUpdateEmail,
    handleSendVerification,
  } = useEmailUpdate(user);

  const {
    currentPassword,
    newPassword,
    confirmNewPassword,
    passwordNotMatchError,
    passwordUpdated,
    showWrongPasswordError,
    weakPassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmNewPassword,
    handleUpdatePassword,
  } = usePasswordUpdate(user);

  return (
    <div>
      <Navbar />
      <div className="profile-settings-page">
        <h1>Account Settings</h1>
        <div className="profile-settings">
          <div className="profile-picture">
            {initialLoading || pictureUploading ? (
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
          <div
            className="divider"
            style={
              user?.providerData[0].providerId !== "password"
                ? { height: "500px" }
                : null
            }
          ></div>
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
            {user?.providerData[0].providerId === "password" && (
              <>
                <div className="button-container">
                  {emailUpdated ? (
                    <p className="email-updated">
                      Email Updated <FontAwesomeIcon icon={faCheck} />
                    </p>
                  ) : (
                    <button
                      onClick={() => setIsAddingNewEmail(true)}
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
                <label htmlFor="confirm-new-password">
                  Confirm New Password:
                </label>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
