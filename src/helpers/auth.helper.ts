import { auth, db, provider } from "@/configs";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export const login = () => {
  signInWithPopup(auth, provider)
    .then((data) => {
      const user = data.user;
      setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          name: user.providerData[0].displayName,
          image: user.photoURL,
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
    })
    .catch((error) => {
      console.log(error);
    });
};

export const logout = async () => {
  await signOut(auth);
};
