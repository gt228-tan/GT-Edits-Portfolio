
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy }
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCni5c6BkrXL-u_DkancVjwigrCWZa5WgE",
  authDomain: "gtedits-3fa90.firebaseapp.com",
  projectId: "gtedits-3fa90",
  storageBucket: "gtedits-3fa90.appspot.com",
databaseURL: "https://gtedits-3fa90-default-rtdb.asia-southeast1.firebasedatabase.app/",
  messagingSenderId: "711433377766",
  appId: "1:711433377766:web:2b2113305193b501722827"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);
// Function to load clients from Realtime Database
async function loadClientsRealtime() {
    const grid = document.getElementById("clients-grid");
    grid.innerHTML = `<p class="text-white text-center col-span-5">Loading clients from Realtime Database...</p>`;

    try {
        const clientsRef = ref(rtdb, "clients");
        onValue(clientsRef, (snapshot) => {
            grid.innerHTML = "";
            const clients = snapshot.val();
            if (!clients) {
                grid.innerHTML = `<p class="text-white text-center col-span-5">No clients found in Realtime Database.</p>`;
                return;
            }
            // If clients is an object, convert to array
            let clientList = Array.isArray(clients) ? clients : Object.values(clients);
              // Sort by 'subscribers' count (descending)
              clientList = clientList.sort((a, b) => {
                  // Extract numeric value from subscribers string (e.g., '67k', '2k')
                  const parseSubs = (subs) => {
                      if (typeof subs === 'string') {
                          const match = subs.match(/(\d+(?:\.\d+)?)([kK]?)/);
                          if (match) {
                              let num = parseFloat(match[1]);
                              if (match[2].toLowerCase() === 'k') num *= 1000;
                              return num;
                          }
                      }
                      return typeof subs === 'number' ? subs : 0;
                  };
                  return parseSubs(b.subscribers) - parseSubs(a.subscribers);
              });
            clientList.forEach((client) => {
                grid.innerHTML += `
                    <a href="${client.url}" target="_blank" rel="noopener noreferrer" class="client-card-link">
                      <div class="client-card">
                        <div class="client-card-banner">
                          <img src="${client.image}" alt="${client.name}" loading="lazy">
                        </div>
                        <div class="client-card-body">
                          <p class="client-card-name">${client.name}</p>
                          <p class="client-card-subs">${client.subscribers} subscribers</p>
                        </div>
                      </div>
                    </a>
                `;
            });
        }, {
            onlyOnce: true
        });
    } catch (error) {
        console.error("Error loading clients from Realtime Database:", error);
        grid.innerHTML = `<p class="text-red-400 text-center col-span-5">Failed to load clients from Realtime Database.</p>`;
    }
}

async function loadClients() {
    const grid = document.getElementById("clients-grid");
    grid.innerHTML = `<p class="text-white text-center col-span-5">Loading clients...</p>`;

    try {
        // Query: get all clients
        const q = query(collection(db, "clients"));
        const snapshot = await getDocs(q);

        grid.innerHTML = "";

        // Collect all clients into an array
        let clientList = [];
        snapshot.forEach((doc) => {
            clientList.push(doc.data());
        });

        // Sort by 'subscribers' count (descending)
        const parseSubs = (subs) => {
            if (typeof subs === 'string') {
                const match = subs.match(/(\d+(?:\.\d+)?)([kK]?)/);
                if (match) {
                    let num = parseFloat(match[1]);
                    if (match[2].toLowerCase() === 'k') num *= 1000;
                    return num;
                }
            }
            return typeof subs === 'number' ? subs : 0;
        };
        clientList = clientList.sort((a, b) => parseSubs(b.subscribers) - parseSubs(a.subscribers));

        clientList.forEach((client) => {
            grid.innerHTML += `
                <a href="${client.url}" target="_blank" rel="noopener noreferrer" class="client-card-link">
                  <div class="client-card">
                    <div class="client-card-banner">
                      <img src="${client.image}" alt="${client.name}" loading="lazy">
                    </div>
                    <div class="client-card-body">
                      <p class="client-card-name">${client.name}</p>
                      <p class="client-card-subs">${client.subscribers} subscribers</p>
                    </div>
                  </div>
                </a>
              `;
        });

        if (clientList.length === 0) {
            grid.innerHTML = `<p class="text-white text-center col-span-5">No clients found.</p>`;
        }

    } catch (error) {
        console.error("Error loading clients:", error);
        grid.innerHTML = `<p class="text-red-400 text-center col-span-5">Failed to load clients.</p>`;
    }
}


// loadClients(); // Firestore
// Uncomment below to load from Realtime Database instead
loadClientsRealtime();
