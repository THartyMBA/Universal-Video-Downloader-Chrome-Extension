(function() {
  const videos = document.getElementsByTagName('video');
  const found = [];
  for (let video of videos) {
    // Check primary video src
    if (video.src) {
      if (video.src.startsWith('blob:')) {
        console.log('Streaming video (blob URL) found. Actual stream will be detected via network.');
        // We do not push blob URLs as they can't be downloaded directly:contentReference[oaicite:19]{index=19}.
      } else {
        found.push({ url: video.src, label: inferLabel(video.src) });
      }
    }
    // Check <source> elements inside <video>
    for (let source of video.getElementsByTagName('source')) {
      const srcUrl = source.src;
      if (!srcUrl) continue;
      if (srcUrl.startsWith('blob:')) {
        console.log('Streaming video source (blob) found.');
      } else {
        // Avoid adding duplicate URLs already in found
        if (!found.some(item => item.url === srcUrl)) {
          found.push({ url: srcUrl, label: inferLabel(srcUrl) });
        }
      }
    }
  }

  if (found.length > 0) {
    // Send the list of discovered video URLs to the background script
    chrome.runtime.sendMessage({ action: 'foundVideos', videos: found });
  }

  // Helper to infer a simple label from URL (file extension or quality hints)
  function inferLabel(url) {
    url = url.toLowerCase();
    if (url.includes('720') || url.includes('1080') || url.includes('sd') || url.includes('hd')) {
      // If URL has resolution info, use it (e.g., "720p")
      const match = url.match(/(\d+p)|(?:hd|sd)/);
      if (match) return "Video (" + match[0].toUpperCase() + ")";
    }
    // Otherwise label by extension
    if (url.endsWith('.mp4')) return 'Video (MP4)';
    if (url.endsWith('.webm')) return 'Video (WebM)';
    if (url.endsWith('.ogg') || url.endsWith('.ogv')) return 'Video (OGG)';
    return 'Video';
  }
})();
