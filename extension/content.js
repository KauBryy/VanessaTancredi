// Listen for messages from popup
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

    if (host.includes("facebook.com")) {
        // --- FACEBOOK STRATEGY ---

        // 1. Get Text
        // Facebook posts often use div[dir="auto"] for the main content text.
        // We look for the one with the most text content to avoid comments/buttons.
        const textBlocks = Array.from(document.querySelectorAll('div[dir="auto"]'));
        let bestBlock = null;
        let maxLength = 0;

        textBlocks.forEach(block => {
            const text = block.innerText.trim();
            // Filter out short texts (names, buttons)
            if (text.length > 50 && text.length > maxLength) {
                maxLength = text.length;
                bestBlock = block;
            }
        });

        if (bestBlock) {
            description = bestBlock.innerText.trim();
        } else {
            // Fallback: try looking for aria-label or specific roles if standard div fails
            // Or try to get selection if user selected text
            const selection = window.getSelection().toString();
            if (selection.length > 20) description = selection;
        }

        // 2. Get Images
        // If we are in "Theater mode" (Photo viewer)
        const theaterImg = document.querySelector('img[data-visualcompletion="media-vc-image"]');
        if (theaterImg) {
            images.push(theaterImg.src);
        }

        // Determine if we are on a feed post or single post
        const allImages = Array.from(document.querySelectorAll('img'));
        allImages.forEach(img => {
            // Filter out small icons, emojis, profile pics (usually small or square small)
            const rect = img.getBoundingClientRect();
            if (rect.width > 300 && rect.height > 300) {
                // Check if it's not an ad (heuristic)
                if (!img.closest('[aria-label="Sponsored"]')) {
                    if (!images.includes(img.src)) images.push(img.src);
                }
            }
        });

    } else if (host.includes("leboncoin.fr")) {
        // --- LEBONCOIN STRATEGY ---

        // Description
        const descDiv = document.querySelector('div[data-test-id="ad-product-description"]');
        if (descDiv) description = descDiv.innerText.trim();

        // Images
        const imgElements = document.querySelectorAll('img');
        imgElements.forEach(img => {
            if (img.alt && img.alt.includes("photo")) {
                if (!images.includes(img.src)) images.push(img.src);
            }
        });

    } else {
        // --- GENERIC FALLBACK ---

        // Try to find the largest text block
        const pTags = document.querySelectorAll('p, div, article');
        let bestText = "";

        pTags.forEach(p => {
            if (p.innerText.length > bestText.length) {
                bestText = p.innerText;
            }
        });
        if (bestText.length > 100) description = bestText;

        // Largest images
        const imgs = document.querySelectorAll('img');
        imgs.forEach(img => {
            if (img.width > 300 && img.height > 300) {
                images.push(img.src);
            }
        });
    }

    return {
        description: description,
        images: images
    };
}
