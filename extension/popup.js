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
                statusDiv.textContent = "✅ Annonce trouvée! Transfert...";

                // Target URL
                const targetUrl = "https://kaubryy.github.io/VanessaTancredi/#/admin/new";

                // 1. Open the tab but keep focus on popup for a split second to ensure logic runs
                // actually better to create it active:false and update later, or just create it.
                // We need to store the tabId.
                const newTab = await chrome.tabs.create({ url: targetUrl, active: true });

                // 2. Wait for tab to load to inject data
                // We define the listener function
                const listener = (tabId, info) => {
                    if (tabId === newTab.id && info.status === 'complete') {
                        // Remove listener to avoid running twice
                        chrome.tabs.onUpdated.removeListener(listener);

                        // 3. Inject data into the page's sessionStorage
                        // We filter unique images here before sending
                        const uniqueImages = [...new Set(response.data.images)];

                        const importData = {
                            description: response.data.description,
                            images: uniqueImages // No limit!
                        };

                        // Execute script in the new tab
                        chrome.scripting.executeScript({
                            target: { tabId: newTab.id },
                            func: (data) => {
                                // This runs inside the page context
                                console.log("Extension injecting data:", data);
                                sessionStorage.setItem('import_data', JSON.stringify(data));

                                // Dispatch event for instant React update if component is listening
                                window.dispatchEvent(new Event('import_data_ready'));

                                // Alternative: If React loaded before this script, we can force a reload 
                                // BUT better UX: The React component should check sessionStorage on mount OR listen to the event.
                                // We'll add a listener in React.
                            },
                            args: [importData]
                        });

                        statusDiv.textContent = "✅ Terminé !";
                    }
                };

                // Add the listener
                chrome.tabs.onUpdated.addListener(listener);

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
