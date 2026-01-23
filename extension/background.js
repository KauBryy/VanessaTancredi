
// Background Service Worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "OPEN_ADMIN_AND_INJECT") {
        openAdminAndInject(request.data);
    }
});

async function openAdminAndInject(importData) {
    const targetUrl = "https://kaubryy.github.io/VanessaTancredi/#/admin/new";

    // 1. Open the tab
    const newTab = await chrome.tabs.create({ url: targetUrl, active: true });

    // 2. Wait for tab to load
    const listener = (tabId, info) => {
        if (tabId === newTab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);

            // 3. Inject after delay
            setTimeout(() => {
                chrome.scripting.executeScript({
                    target: { tabId: newTab.id },
                    world: 'MAIN',
                    func: (data) => {
                        console.log("Extension BG: Injecting data...", data);
                        sessionStorage.setItem('import_data', JSON.stringify(data));
                        window.dispatchEvent(new Event('import_data_ready'));

                        // Feedback UI
                        const div = document.createElement('div');
                        Object.assign(div.style, {
                            position: 'fixed', bottom: '20px', right: '20px',
                            background: '#002B5B', color: 'white', padding: '16px',
                            borderRadius: '8px', zIndex: '999999',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            fontFamily: 'sans-serif', fontWeight: 'bold',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        });
                        div.innerHTML = '<span>✅ Import réussi !</span>';
                        document.body.appendChild(div);
                        setTimeout(() => div.remove(), 5000);
                    },
                    args: [importData]
                });
            }, 2000); // 2 seconds safety delay
        }
    };
    chrome.tabs.onUpdated.addListener(listener);
}
