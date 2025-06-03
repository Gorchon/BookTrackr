import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = form;
    const fullName = `${firstName} ${lastName}`;
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: fullName });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName,
        lastName,
        email,
        bio: "",
      });
      navigate("/profile");
    } catch (err: any) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md animate-fade-in"
      >
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          Create Your Account
        </h2>
        <div className="space-y-4">
          <input
            name="firstName"
            onChange={handleChange}
            placeholder="First Name"
            className="input-field"
          />
          <input
            name="lastName"
            onChange={handleChange}
            placeholder="Last Name"
            className="input-field"
          />
          <input
            name="email"
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="input-field"
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            className="input-field"
          />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          type="submit"
          className="mt-6 w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-300 transition duration-300"
        >
          Register
        </button>
      </form>
    </div>
  );
}
