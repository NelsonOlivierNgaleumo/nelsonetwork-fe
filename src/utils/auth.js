// src/utils/auth.js
export const signIn = async () => {
  if (typeof window === 'undefined') return;

  const firebase = (await import('firebase/app')).default;
  await import('firebase/auth');

  if (firebase.apps.length) {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  } else {
    throw new Error('Firebase not initialized');
  }
};

export const signOut = async () => {
  if (typeof window === 'undefined') return;

  const firebase = (await import('firebase/app')).default;
  await import('firebase/auth');

  if (firebase.apps.length) {
    await firebase.auth().signOut();
  } else {
    throw new Error('Firebase not initialized');
  }
};
