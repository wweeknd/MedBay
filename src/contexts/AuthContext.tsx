import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserRole, PatientProfile, DoctorProfile } from '../types';
import { mockPatient, mockDoctors } from '../data/mockData';
import { auth, db } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/* ═══════════════════════════════════════════════════
   DEMO ACCOUNTS
   ═══════════════════════════════════════════════════ */
const DEMO_ACCOUNTS = {
  patient: {
    email: 'patient@medbay.com',
    password: 'demo1234',
    displayName: 'Alex Rivera',
  },
  doctor: {
    email: 'doctor@medbay.com',
    password: 'demo1234',
    displayName: 'Dr. Sarah Chen',
  },
};

interface AuthContextType {
  user: (PatientProfile | DoctorProfile) | null;
  userRole: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, role: UserRole, name: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updatePatientProfile: (updates: Partial<PatientProfile>) => void;
  updateDoctorProfile: (updates: Partial<DoctorProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

/* Helper: Create a truly clean profile for new real accounts without leaking Raj Patel's demo data */
function createBasePatientProfile(uid: string, email: string, name: string): PatientProfile {
  return {
    ...mockPatient, // keeps type checking valid for nested arrays like emergency contacts
    uid,
    email,
    displayName: name,
    dateOfBirth: '',
    bloodGroup: '',
    phone: '',
    address: '',
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
  };
}
function createBaseDoctorProfile(uid: string, email: string, name: string): DoctorProfile {
  return {
    ...mockDoctors[0], // Keep basic structure/schedule template
    uid,
    email,
    displayName: name,
    specialization: 'General Medicine',
    qualifications: [],
    yearsOfExperience: 0,
    hospital: '',
    clinicAddress: '',
    consultationFee: 0,
    bio: '',
    achievements: [],
    languages: ['English'],
    treatmentPhilosophy: '',
    rating: 0,
    totalReviews: 0,
    isVerified: email.toLowerCase() === 'sssushanth2007@gmail.com', // Auto-verify Sushanth
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(PatientProfile | DoctorProfile) | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const skipNextAuthStateChange = React.useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // If login() or register() already set state, skip the Firestore fetch to avoid overwriting
      if (skipNextAuthStateChange.current) {
        skipNextAuthStateChange.current = false;
        setIsLoading(false);
        return;
      }

      if (firebaseUser) {
        // Check if we already have a valid user in state (e.g. from demo login)
        // Only fetch from Firestore if we don't have user state yet
        if (!user) {
          const savedRole = localStorage.getItem('medbay_role') as UserRole | null;
          
          // Provide an instant optimistic UI if we have locally cached role
          if (savedRole) {
            setUserRole(savedRole);
            if (savedRole === 'patient') {
              const savedLocal = localStorage.getItem(`medbay_patient_profile_${firebaseUser.uid}`);
              const overrides = savedLocal ? JSON.parse(savedLocal) : {};
              setUser({ ...createBasePatientProfile(firebaseUser.uid, firebaseUser.email!, firebaseUser.displayName || 'Patient'), ...overrides });
            } else {
              const savedLocal = localStorage.getItem(`medbay_doctor_profile_${firebaseUser.uid}`);
              const overrides = savedLocal ? JSON.parse(savedLocal) : {};
              const name = firebaseUser.displayName || 'Doctor';
              // If it's karthik, always start fresh if no overrides
              const base = (name.toLowerCase() === 'karthik' && !savedLocal) 
                ? createBaseDoctorProfile(firebaseUser.uid, firebaseUser.email!, name)
                : { ...mockDoctors[0], uid: firebaseUser.uid, email: firebaseUser.email!, displayName: name };
              setUser({ ...base, ...overrides });
            }
            setIsLoading(false);
          }

          // Fetch from Firestore non-blocking
          getDoc(doc(db, 'users', firebaseUser.uid)).then(userDoc => {
            if (userDoc.exists()) {
              const data = userDoc.data();
              const role = data.role as UserRole;
              if (role !== userRole) {
                setUserRole(role);
                localStorage.setItem('medbay_role', role);
                if (role === 'patient') {
                  const savedLocal = localStorage.getItem(`medbay_patient_profile_${firebaseUser.uid}`);
                  const overrides = savedLocal ? JSON.parse(savedLocal) : {};
                  setUser({ ...createBasePatientProfile(firebaseUser.uid, firebaseUser.email!, firebaseUser.displayName || data.name), ...overrides });
                } else {
                  const savedLocal = localStorage.getItem(`medbay_doctor_profile_${firebaseUser.uid}`);
                  const overrides = savedLocal ? JSON.parse(savedLocal) : {};
                  const name = firebaseUser.displayName || data.name;
                  const isKarthik = name.toLowerCase().includes('karthik');
                  const base = (isKarthik && !savedLocal)
                    ? createBaseDoctorProfile(firebaseUser.uid, firebaseUser.email!, name)
                    : { ...mockDoctors[0], uid: firebaseUser.uid, email: firebaseUser.email!, displayName: name };
                  setUser({ ...base, ...overrides });
                }
              }
            } else if (!savedRole) {
               // Fallback if no doc and no local cache
               setUserRole('patient');
               setUser({ ...createBasePatientProfile(firebaseUser.uid, firebaseUser.email!, firebaseUser.displayName || 'Patient') });
            }
          }).catch(error => {
            console.error("Error fetching user data:", error);
            if (!savedRole) {
               setUserRole('patient');
               setUser({ ...createBasePatientProfile(firebaseUser.uid, firebaseUser.email!, firebaseUser.displayName || 'Patient') });
            }
          }).finally(() => {
            setIsLoading(false);
          });
          return;
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string, requestedRole: UserRole) => {
    // If using the hardcoded demo credentials, just use the old mock flow to allow demoing without hitting firebase limits
    if ((email === DEMO_ACCOUNTS.patient.email || email === DEMO_ACCOUNTS.doctor.email) && password === 'demo1234') {
      if (requestedRole === 'patient') {
        const saved = localStorage.getItem('medbay_patient_profile_demo');
        const overrides = saved ? JSON.parse(saved) : {};
        setUser({ ...mockPatient, email, ...overrides });
        setUserRole('patient');
      } else {
        setUser({ ...mockDoctors[0], email, displayName: DEMO_ACCOUNTS.doctor.displayName });
        setUserRole('doctor');
      }
      localStorage.setItem('medbay_role', requestedRole);
      return;
    }

    // Real Firebase Login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // We intentionally do not await the database check here because if Firestore isn't provisioned,
    // it will hang forever due to Firebase's offline persistence retries.
    getDoc(doc(db, 'users', userCredential.user.uid)).then(userDoc => {
      if (userDoc.exists() && userDoc.data().role !== requestedRole) {
        console.warn(`User is actually a ${userDoc.data().role}, but logged in via the ${requestedRole} tab!`);
      }
    }).catch(e => console.error("Could not fetch user role from DB:", e));

    skipNextAuthStateChange.current = true;
    setUserRole(requestedRole);
    if (requestedRole === 'patient') {
      const savedLocal = localStorage.getItem(`medbay_patient_profile_${userCredential.user.uid}`);
      const overrides = savedLocal ? JSON.parse(savedLocal) : {};
      setUser({ ...createBasePatientProfile(userCredential.user.uid, userCredential.user.email!, userCredential.user.displayName || 'Patient'), ...overrides });
    } else {
      const savedLocal = localStorage.getItem(`medbay_doctor_profile_${userCredential.user.uid}`);
      const overrides = savedLocal ? JSON.parse(savedLocal) : {};
      const name = userCredential.user.displayName || 'Doctor';
      const isKarthik = name.toLowerCase().includes('karthik');
      const base = (isKarthik && !savedLocal)
        ? createBaseDoctorProfile(userCredential.user.uid, userCredential.user.email!, name)
        : { ...mockDoctors[0], uid: userCredential.user.uid, email: userCredential.user.email!, displayName: name };
      setUser({ ...base, ...overrides });
    }
    localStorage.setItem('medbay_role', requestedRole);
  };

  const register = async (email: string, password: string, role: UserRole, name: string) => {
    // Real Firebase Registration
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update auth profile
    await updateProfile(user, { displayName: name });

    // Create user document in Firestore to lock in their role
    // Do not await this so it doesn't hang the UI if Firestore isn't fully ready
    setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    }).catch(e => console.error("Could not save user document:", e));

    skipNextAuthStateChange.current = true;
    setUserRole(role);
    if (role === 'patient') {
      const savedLocal = localStorage.getItem(`medbay_patient_profile_${user.uid}`);
      const overrides = savedLocal ? JSON.parse(savedLocal) : {};
      setUser({ ...createBasePatientProfile(user.uid, user.email!, name), ...overrides });
    } else {
      // New registrations are ALWAYS clean profiles from now on
      setUser(createBaseDoctorProfile(user.uid, user.email!, name));
    }
    localStorage.setItem('medbay_role', role);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('medbay_role');
  };

  const switchRole = (role: UserRole) => {
    // Keeping this for the demo accounts
    if (role === 'patient') {
      const saved = localStorage.getItem('medbay_patient_profile_demo');
      const overrides = saved ? JSON.parse(saved) : {};
      setUser({ ...mockPatient, email: DEMO_ACCOUNTS.patient.email, ...overrides });
      setUserRole('patient');
    } else {
      setUser({ ...mockDoctors[0], email: DEMO_ACCOUNTS.doctor.email, displayName: DEMO_ACCOUNTS.doctor.displayName });
      setUserRole('doctor');
    }
  };

  const updatePatientProfile = useCallback((updates: Partial<PatientProfile>) => {
    setUser(prev => {
      if (!prev || prev.role !== 'patient') return prev;
      const newProfile = { ...prev, ...updates };
      
      // Save to localStorage for now (in a real app, this would hit Firestore)
      const { displayName, photoURL, allergies, chronicConditions, bloodGroup, phone, address, gender, dateOfBirth } = newProfile;
      const storageKey = prev.email === DEMO_ACCOUNTS.patient.email ? 'medbay_patient_profile_demo' : `medbay_patient_profile_${prev.uid}`;
      localStorage.setItem(storageKey, JSON.stringify({
        displayName, photoURL, allergies, chronicConditions, bloodGroup, phone, address, gender, dateOfBirth
      }));
      
      return newProfile;
    });
  }, []);

  /* Save button or profile management could go here if needed */
  const updateDoctorProfile = useCallback((updates: Partial<DoctorProfile>) => {
    setUser(prev => {
      if (!prev || prev.role !== 'doctor') return prev;
      const newProfile = { ...prev, ...updates };
      const storageKey = `medbay_doctor_profile_${prev.uid}`;
      localStorage.setItem(storageKey, JSON.stringify(newProfile)); // COMPLETE persistence
      return newProfile;
    });
  }, []);

  const value = {
    user,
    userRole,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    switchRole,
    updatePatientProfile,
    updateDoctorProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
