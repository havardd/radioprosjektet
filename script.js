let lastFetchedData = null;

// Funksjon for å hente og oppdatere data
function fetchAndUpdateData() {
  fetch("https://psapi.nrk.no/channels/p13/liveelements")
    .then(response => response.json())
    .then(data => {
      // Sjekk om vi har nye data
      if (JSON.stringify(data) !== JSON.stringify(lastFetchedData)) {
        
        console.log("Nye data hentet:", data);
        lastFetchedData = data;

        // Variabler for DOM-elementer
        const contentDiv = document.getElementById("content");
        const programTitleDiv = document.getElementById("program-title");
        const lastUpdatedDiv = document.getElementById("last-updated");
        const nextUpdateDiv = document.getElementById("next-update");
        const titleCountdownDiv = document.getElementById("title-countdown");
        const descriptionCountdownDiv = document.getElementById("description-countdown");
        const imageCountdownDiv = document.getElementById("image-countdown");

        let titleCountdown = 20; // Endret fra 10 til 20
        let descriptionCountdown = 10; // Endret fra 20 til 10
        let imageCountdown = 25;

        let titleDisplayed = false;
        let descriptionDisplayed = false;
        let imageDisplayed = false;

        if (data && data.length > 0) {
          const lastElement = data[data.length - 1];
          console.log("Siste element:", lastElement);

          // Variabler for å holde informasjon om programmet
          const programTitle = lastElement.programTitle || "Ingen programtittel tilgjengelig";
          programTitleDiv.textContent = programTitle; // Sett programtittel

          // Variabler for å holde informasjon om siste element
          const title = lastElement.title || "Ingen tittel tilgjengelig";
          const description = lastElement.description || "Ingen beskrivelse tilgjengelig";
          const type = lastElement.type || "";
          const contributors = lastElement.contributors || [];
          const imageUrl = lastElement.imageUrl || "";
          console.log("Bidragsytere:", contributors.map(contributor => contributor.name)); // Console logge navnene

          // Rens innholdet i hoveddiven
          contentDiv.innerHTML = ``;

          // Sjekk om siste element er av typen nyheter
          if (type === "News") {
            contentDiv.innerHTML = `<h3 class="news-heading">Nå babler de bare om ${title}</h3>`;
          } else {
            // Nedtelling for å vise tittelen, beskrivelsen og bildet
            const intervalId = setInterval(() => {
              // Håndter visning av beskrivelsen først
              if (descriptionCountdown === 0 && !descriptionDisplayed) {
                contentDiv.innerHTML += `<h2 class="song-title">Artist: ${description}</h2>`;
                descriptionCountdownDiv.textContent = `Artist vises om: 0 sekunder`;
                descriptionDisplayed = true;
              } else if (!descriptionDisplayed) {
                descriptionCountdownDiv.textContent = `Artist vises om: ${descriptionCountdown} sekunder`;
              }

              // Håndter visning av tittelen etter beskrivelsen
              if (titleCountdown === 0 && !titleDisplayed) {
                contentDiv.innerHTML += `<p class="song-artist">Låt: ${title}</p>`;
                titleCountdownDiv.textContent = `Låt vises om: 0 sekunder`;
                titleDisplayed = true;
              } else if (!titleDisplayed) {
                titleCountdownDiv.textContent = `Låt vises om: ${titleCountdown} sekunder`;
              }

              // Håndter visning av bildet til slutt
              if (imageCountdown === 0 && !imageDisplayed) {
                if (imageUrl) {
                  contentDiv.innerHTML += `<img src="${imageUrl}" alt="${description} bilde" class="song-image">`;
                }
                imageCountdownDiv.textContent = `Bilde vises om: 0 sekunder`;
                imageDisplayed = true;
                clearInterval(intervalId); // Stopp nedtellingen når bildet vises
              } else if (!imageDisplayed) {
                imageCountdownDiv.textContent = `Bilde vises om: ${imageCountdown} sekunder`;
              }

              titleCountdown = Math.max(titleCountdown - 1, 0);
              descriptionCountdown = Math.max(descriptionCountdown - 1, 0);
              imageCountdown = Math.max(imageCountdown - 1, 0);
            }, 1000);
          }

          // Håndter bidragsytere
          if (contributors.length > 0) {
            const contributorsText = contributors.map(contributor => contributor.name).join(", ");
            contentDiv.innerHTML += `<h4 class="contributors">Programleder: ${contributorsText}</h4>`;
          }

          const now = new Date();
          lastUpdatedDiv.textContent = `Sist oppdatert: ${now.toLocaleString()}`;
        }
      } else {
        console.log("Ingen nye data.");
      }
    })
    .catch(error => console.error("Feil ved henting av data:", error));
}

let countdown = 30;
function updateCountdown() {
  const nextUpdateDiv = document.getElementById("next-update");
  countdown--;
  if (countdown < 0) {
    countdown = 30;
  }
  nextUpdateDiv.textContent = `Neste oppdatering om: ${countdown} sekunder`;
}

// Initial henting og oppdatering
fetchAndUpdateData();
setInterval(fetchAndUpdateData, 30000);

// Start nedtelling for neste oppdatering
setInterval(updateCountdown, 1000);
