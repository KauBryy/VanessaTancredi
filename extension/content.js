// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SCRAPE") {
        const data = scrapePage();
        sendResponse({ success: !!(data.description || data.images.length), data: data });
    }
    return true;
});

function scrapePage() {
    let description = "";
    let images = [];
    const host = window.location.hostname;

    // --- Helper: Extract unique ID from Facebook URL ---
    // FB URLs look like: .../123456_9876543210_12345_n.jpg?...
    // The middle long number is usually the unique photo ID.
    function getFbImageId(url) {
        try {
            const match = url.match(/\/(\d+)_(\d+)_(\d+)_/);
            return match ? match[2] : url; // Return middle ID or full URL if no match
        } catch (e) { return url; }
    }

    if (host.includes("facebook.com")) {
        // --- TEXT STRATEGY (Improved for Emojis) ---
        // We prioritize the main post content container.
        const textContainer = document.querySelector('div[data-ad-comet-preview="message"], div[dir="auto"]');

        if (textContainer) {
            // We use innerText which usually preserves emojis on Mac/Windows
            // We can also try to clone and replace images with alt text, but let's stick to text first.
            description = textContainer.innerText || textContainer.textContent;
        }

        // --- IMAGE STRATEGY (Deduping + Collage) ---
        const rawImages = [];

        // 1. Theater Mode (Single large image)
        const theaterImg = document.querySelector('img[data-visualcompletion="media-vc-image"]');
        if (theaterImg) rawImages.push(theaterImg.src);

        // 2. Feed / Post Mode (Collage)
        // Select all images in the main role/feed area to avoid sidebar ads
        const mainContent = document.querySelector('[role="main"]') || document.body;
        const imgs = Array.from(mainContent.querySelectorAll('img'));

        imgs.forEach(img => {
            // Filter out fluff
            if (img.width > 200 && img.height > 200) { // Lower threshold slightly
                if (!img.closest('[aria-label="Sponsored"]')) {
                    rawImages.push(img.src);
                }
            }
        });

        // 3. Smart Deduping
        const seenIds = new Set();

        rawImages.forEach(url => {
            const id = getFbImageId(url);
            if (!seenIds.has(id)) {
                seenIds.add(id);
                images.push(url);
            }
        });

    } else {
        // --- GENERIC FALLBACK ---
        const pTags = document.querySelectorAll('p, div, article');
        let bestText = "";
        pTags.forEach(p => {
            if (p.innerText.length > bestText.length) bestText = p.innerText;
        });
        if (bestText.length > 50) description = bestText;

        const imgs = document.querySelectorAll('img');
        const seen = new Set();
        imgs.forEach(img => {
            if (img.width > 300 && img.height > 300 && !seen.has(img.src)) {
                seen.add(img.src);
                images.push(img.src);
            }
        });
    }

    return {
        description: description,
        images: images
    };
}
