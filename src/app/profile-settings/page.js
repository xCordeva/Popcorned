"use client";
import useAuth from "@/Custom Hooks/useAuth";
import Navbar from "../components/Navbar";
import "@/css/ProfilePage.css";
import { useState } from "react";
import usePopupCloser from "@/Custom Hooks/usePopupCloser";

export default function ProfilePage() {
  usePopupCloser();
  const { user } = useAuth();
  const [isAddingNewEmail, setIsAddingNewEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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

  return (
    <div>
      <Navbar />
      <div className="profile-settings-page">
        <h1>Account Settings</h1>
        <div className="profile-settings">
          <div className="profile-picture">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/no-image-avaiable.jpg?alt=media&token=f01f2f4a-c8db-4e5f-8f7f-c920219a77fd"
              alt="user-profile-picture"
            />
            <button>Choose Picture</button>
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
                  <button onClick={() => handleSendVerification(user.email)}>
                    Send Verification
                  </button>
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
