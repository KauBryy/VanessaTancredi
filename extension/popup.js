document.getElementById('scrapeBtn').addEventListener('click', async () => {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = "Analyse en cours...";

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab) {
            statusDiv.textContent = "Erreur: Onglet introuvable.";
            return;
        }

        // Send message to content script
        try {
            const response = await chrome.tabs.sendMessage(tab.id, { action: "SCRAPE" });

            if (response && response.success) {
                statusDiv.textContent = "✅ Annonce trouvée! Ouverture...";

                // Construct URL with parameters
                // Note: Ensure strictly encoded components to avoid URL breaking
                // const baseUrl = "http://localhost:5173/#/admin/new"; // DEV (HashRouter makes it #/admin/new)
                const prodUrl = "https://kaubryy.github.io/VanessaTancredi/#/admin/new"; // PROD

                // We use URLSearchParams to handle encoding safely
                const params = new URLSearchParams();
                if (response.data.description) params.append('import_desc', response.data.description);
                if (response.data.images && response.data.images.length > 0) {
                    // Only send the first 5 images to avoid URL length limits
                    // We send them as a comma separated list
                    params.append('import_imgs', response.data.images.slice(0, 5).join(','));
                }

                const finalUrl = `${prodUrl}?${params.toString()}`;

                // Open the admin page
                chrome.tabs.create({ url: finalUrl });
            } else {
                statusDiv.textContent = "❌ Aucune annonce détectée. Assurez-vous d'être sur la page d'un post.";
            }
        } catch (msgError) {
            console.error(msgError);
            statusDiv.textContent = "❌ Erreur de communication. Rechargez la page Facebook.";
        }

    } catch (error) {
        console.error(error);
        statusDiv.textContent = "❌ Erreur inattendue.";
    }
});
