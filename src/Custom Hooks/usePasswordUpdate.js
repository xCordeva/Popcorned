import { useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const usePasswordUpdate = (user) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
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
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setPasswordUpdated(true);
        setCurrentPassword("");
        setConfirmNewPassword("");
        setNewPassword("");
        setShowWrongPasswordError(false);
        setWeakPassword(false);
        setPasswordNotMatchError(false);
      } catch (error) {
        if (error.code === "auth/wrong-password") {
          setShowWrongPasswordError(true);
          setPasswordNotMatchError(false);
          setWeakPassword(false);
        } else if (error.code === "auth/weak-password") {
          setWeakPassword(true);
          setShowWrongPasswordError(false);
          setPasswordNotMatchError(false);
        } else {
          console.error("Error updating password: ", error);
        }
      }
    } else {
      setPasswordNotMatchError(true);
      setWeakPassword(false);
      setShowWrongPasswordError(false);
    }
  };

  return {
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
  };
};

export default usePasswordUpdate;
