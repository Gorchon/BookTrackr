import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  updateProfile as updateAuthProfile,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import {
  doc,
  getDoc,
  setDoc, // we’ll use merge:true for upserts
} from "firebase/firestore";
import "./Profile.css";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  /* ---------------- AUTH LISTENER ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUid(user?.uid ?? null);

      if (user?.uid) {
        // Pull data whenever auth state changes
        await fetchProfile(user.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  /* ---------------- READ PROFILE ---------------- */
  const fetchProfile = async (userId: string) => {
    try {
      const snap = await getDoc(doc(db, "users", userId));
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setMessage("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UPDATE PROFILE ---------------- */
  const handleSave = async () => {
    if (!uid) return;

    try {
      await setDoc(doc(db, "users", uid), profile, { merge: true });
      // Optional: keep Firebase-Auth displayName in sync
      await updateAuthProfile(auth.currentUser!, {
        displayName: `${profile.firstName} ${profile.lastName}`,
      });
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  /* ---------------- INPUT HANDLER ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  if (loading) return <p className="profile-title">Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Your Profile</h2>

        <input
          className="input-field"
          name="firstName"
          value={profile.firstName}
          onChange={handleChange}
          placeholder="First Name"
        />
        <input
          className="input-field"
          name="lastName"
          value={profile.lastName}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <input
          className="input-field input-disabled"
          name="email"
          value={profile.email}
          disabled
          placeholder="Email"
        />
        <textarea
          className="input-field"
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          placeholder="Your bio"
        />

        <button onClick={handleSave} className="save-button">
          Save
        </button>
        <button
          onClick={() => uid && fetchProfile(uid)}
          className="save-button"
          style={{ marginTop: "0.5rem", background: "#222", color: "#facc15" }}
        >
          Refresh
        </button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
