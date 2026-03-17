// ============================================================
//  🔧firebaseConfig 
// ============================================================
const firebaseConfig = {
  apiKey:            "AIzaSyCm8pP02p2sJ1dDfNYKpP6IBZhopQP-sjY",
  authDomain:        "fitness-tracker-amit.firebaseapp.com",
  projectId:         "fitness-tracker-amit",
  storageBucket:     "fitness-tracker-amit.firebasestorage.app",
  messagingSenderId: "400048635012",
  appId:             "1:400048635012:web:f87a37ab71cd2195fc56d1"
};
// ============================================================

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

let currentUser  = null;
let unsubscribe  = null;
let localCache   = { weights: [], measurements: [], goals: {} };
let loginPending = false;

// ---------- Auth ----------
// ---------- Auth ----------
let authResolved = false;

function isIOSPWA() {
  return window.navigator.standalone === true;
}

function signInWithGoogle() {
  if (loginPending) return;
  loginPending = true;

  const provider = new firebase.auth.GoogleAuthProvider();
  
  provider.setCustomParameters({
  prompt: 'select_account'
});

  if (isIOSPWA()) {
    sessionStorage.setItem('iosPwaLoginInProgress', '1');

    auth.signInWithRedirect(provider).catch(e => {
      loginPending = false;
      sessionStorage.removeItem('iosPwaLoginInProgress');
      alert('שגיאה בכניסה: ' + e.message);
    });
    return;
  }

  auth.signInWithPopup(provider)
    .catch(e => {
      if (
        e.code !== 'auth/cancelled-popup-request' &&
        e.code !== 'auth/popup-closed-by-user'
      ) {
        alert('שגיאה בכניסה: ' + e.message);
      }
    })
    .finally(() => {
      loginPending = false;
    });
}

async function initAuth() {
  try {
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    await auth.getRedirectResult();
  } catch (e) {
    if (e.code !== 'auth/no-current-user') {
      console.error('Redirect error:', e);
    }
  } finally {
    loginPending = false;
    authResolved = true;
  }

  auth.onAuthStateChanged(user => {
    currentUser = user;

    if (user) {
      sessionStorage.removeItem('iosPwaLoginInProgress');
      showApp(user);
      subscribeToUserData(user.uid);
      return;
    }

    const loginInProgress = sessionStorage.getItem('iosPwaLoginInProgress') === '1';

    if (isIOSPWA() && loginInProgress) {
      setTimeout(() => {
        if (!auth.currentUser) {
          sessionStorage.removeItem('iosPwaLoginInProgress');
          showLogin();
        }
      }, 1500);
      return;
    }

    showLogin();
  });
}

function signOutUser() {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  sessionStorage.removeItem('iosPwaLoginInProgress');
  auth.signOut();
}

function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app-wrap').style.display = 'none';
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
}

function showApp(user) {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-wrap').style.display = 'block';
  document.getElementById('user-name').textContent = user.displayName || user.email;

  const av = document.getElementById('user-avatar');
  av.src = user.photoURL || '';
  av.style.display = user.photoURL ? 'block' : 'none';
}

initAuth();

// ---------- Firestore real-time listener ----------
function subscribeToUserData(uid) {
  if (unsubscribe) unsubscribe();
  unsubscribe = db.collection('users').doc(uid).onSnapshot(snap => {
    if (snap.exists) {
      const d = snap.data();
      localCache = {
        weights:      d.weights      || [],
        measurements: d.measurements || [],
        goals:        d.goals        || {}
      };
    } else {
      localCache = { weights: [], measurements: [], goals: {} };
    }
    render();
  });
}

// ---------- Data API ----------
function getData() { return localCache; }

async function saveData(key, value) {
  if (!currentUser) return;
  localCache[key] = value;
  try {
    await db.collection('users').doc(currentUser.uid).set(
      { [key]: value }, { merge: true }
    );
  } catch(e) { console.error('Save error:', e); showToast('⚠️ שגיאה בשמירה'); }
}