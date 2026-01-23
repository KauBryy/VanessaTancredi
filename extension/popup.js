document.getElementById('scrapeBtn').addEventListener('click', async () => {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = "Analyse en cours...";

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab) {
            statusDiv.textContent = "Erreur: Onglet introuvable.";
            return;
        }

        // 1. Ask content script to scrape
        try {
            const response = await chrome.tabs.sendMessage(tab.id, { action: "SCRAPE" });

            if (response && response.success) {
                statusDiv.textContent = "✅ Annonce trouvée ! Ouverture...";

                // 2. Send data to Background Script
                const uniqueImages = [...new Set(response.data.images)];

                chrome.runtime.sendMessage({
                    action: "OPEN_ADMIN_AND_INJECT",
                    data: {
                        description: response.data.description,
                        images: uniqueImages
                    }
                });

            } else {
                statusDiv.textContent = "❌ Aucune annonce détectée.";
            }
        } catch (msgError) {
            console.error(msgError);
            statusDiv.textContent = "❌ Erreur : Rechargez la page Facebook.";
        }

    } catch (error) {
        console.error(error);
        statusDiv.textContent = "❌ Erreur inattendue.";
    }
});
