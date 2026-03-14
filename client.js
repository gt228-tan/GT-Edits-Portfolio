
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
            // Sort by 'order' field (ascending)
            clientList = clientList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
        // Query: get all clients ordered by 'order' field
        const q = query(collection(db, "clients"), orderBy("order"));
        const snapshot = await getDocs(q);

        grid.innerHTML = ""; 

        snapshot.forEach((doc) => {
            const client = doc.data();
              grid.innerHTML += `
                <a href="${client.url}" target="_blank" rel="noopener noreferrer" class="client-card-link">
                  <div class="client-card">
                    <div class="client-card-banner">
                      <img src="${client.image}" alt="${client.name}" loading="lazy">
                    </div>
                    <div class="client-card-body">
                      <p class="client-card-name">${client.name}</p>
                      <p class="client-card-subs">${client.subscribers}</p>
                    </div>
                  </div>
                </a>
              `;
        });

        if (snapshot.empty) {
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
