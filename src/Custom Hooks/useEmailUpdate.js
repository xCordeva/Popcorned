import { useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
} from "firebase/auth";

const useEmailUpdate = (user) => {
  const [isAddingNewEmail, setIsAddingNewEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [passwordOfUpdateEmail, setPasswordOfUpdateEmail] = useState("");
  const [emailUpdated, setEmailUpdated] = useState(false);
  const [showInvalidEmailError, setShowInvalidEmailError] = useState(false);
  const [showInvalidPasswordError, setShowInvalidPasswordError] =
    useState(false);
  const [emailVerficationSent, setEmailVerficationSent] = useState(false);

  const handleUpdateEmail = async () => {
    const credential = EmailAuthProvider.credential(
      user.email,
      passwordOfUpdateEmail
    );
    try {
      if (newEmail === "") {
        setShowInvalidEmailError(true);
      } else {
        await reauthenticateWithCredential(user, credential);
        await updateEmail(user, newEmail);
        setEmailUpdated(true);
        setShowInvalidPasswordError(false);
        setShowInvalidEmailError(false);
        setIsAddingNewEmail(false);
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

  const handleSendVerification = async () => {
    try {
      await sendEmailVerification(user);
      setEmailVerficationSent(true);
    } catch (error) {
      console.error(error);
      setEmailVerficationSent(false);
    }
  };

  return {
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
    setEmailVerficationSent,
    handleUpdateEmail,
    handleSendVerification,
  };
};

export default useEmailUpdate;
