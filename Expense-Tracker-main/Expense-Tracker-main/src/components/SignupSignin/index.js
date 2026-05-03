import React, { useState } from 'react';
import './styles.css';
import Input from '../Input';
import Button from '../Button';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';

function SignupSigninComponent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginForm, setLoginForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider(); // Initialize Google Auth Provider

  function signupWithEmail() {
    setLoading(true);

    if (name !== '' && email !== '' && password !== '' && confirmPassword !== '') {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            toast.success('User Created!');
            resetFormFields();
            createDoc(user); 
            navigate("/dashboard");
          })
          .catch((error) => {
            toast.error(error.message);
          })
          .finally(() => setLoading(false)); // Ensure loading state is updated
      } else {
        toast.error("Password and Confirm Password don't match!");
        setLoading(false);
      }
    } else {
      toast.error('All fields are mandatory!');
      setLoading(false);
    }
  }

  function loginUsingEmail() {
    setLoading(true);
    if (email !== '' && password !== '') {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success('User Logged In');
          navigate("/dashboard");
          resetFormFields();
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => setLoading(false)); // Ensure loading state is updated
    } else {
      toast.error('Email and Password are required');
      setLoading(false);
    }
  }

  async function createDoc(user) {
    console.log('Creating document for user:', user);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(userRef, {  // Using userRef directly
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),  // Setting createdAt to current date
        });
        toast.success("User document created successfully");
      } catch (e) {
        toast.error(e.message);
      }
    } else {
      toast.error("User document already exists");
    }
  }

  function resetFormFields() {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  function googleAuth() {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        toast.success("User authenticated!");
        createDoc(user); // Create user document in Firestore
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      })
      .finally(() => setLoading(false)); // Ensure loading state is updated
  }

  return (
    <>
      {loginForm ? (
        <div className='signup-wrapper'>
          <h2 className='title'>
            Login on <span style={{ color: 'var(--theme)' }}>Expensely.</span>
          </h2>
          <form>
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"ElonMusk@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login Using Email and Password"}
              onClick={loginUsingEmail}
            />
            <p style={{ textAlign: "center", margin: 0 }}>OR</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading... " : "Login Using Google"}
              blue={true}
            />
            <p className='p-login'
              style={{ cursor: "pointer" }}
              onClick={() => {
                setLoginForm(false); 
                resetFormFields();
              }}
            >
              Don't have an account? Click here
            </p>
          </form>
        </div>
      ) : (
        <div className='signup-wrapper'>
          <h2 className='title'>
            Sign up on <span style={{ color: 'var(--theme)' }}>Expensely.</span>
          </h2>
          <form>
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"Elon Musk"}
            />
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"ElonMusk@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Signup Using Email and Password"}
              onClick={signupWithEmail}
            />
            <p style={{ textAlign: "center", margin: 0 }}>OR</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading... " : "Signup Using Google"}
              blue={true}
            />
            <p className='p-login'
              style={{ cursor: "pointer" }}
              onClick={() => {
                setLoginForm(true);
                resetFormFields();
              }}
            >
              Already have an account? Click here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSigninComponent;
