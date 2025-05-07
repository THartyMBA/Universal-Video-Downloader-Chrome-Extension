document.addEventListener('DOMContentLoaded', async () => {
    const videoList = document.getElementById('videoList');
    const noVideosMsg = document.getElementById('noVideosMsg');
    videoList.innerHTML = '';
    noVideosMsg.style.display = 'none';

    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    let videosDetected = false;

    chrome.runtime.sendMessage({action: 'getVideos', tabId: tab.id}, (videos) => {
        if (videos && videos.length > 0) {
            videosDetected = true;
            videos.forEach((video, index) => {
                const li = document.createElement('li');
                const btn = document.createElement('button');
                btn.textContent = `Download Video ${index + 1}`;
                btn.onclick = () => {
                    chrome.downloads.download({
                        url: video.url,
                        filename: `video${index + 1}.mp4`,
                        saveAs: false
                    });
                    window.close();
                };
                li.appendChild(btn);
                videoList.appendChild(li);
            });
        }

        if (tab.url.includes("youtube.com/watch") || tab.url.includes("youtube.com/shorts")) {
            videosDetected = true;
            const ytLi = document.createElement('li');
            const ytBtn = document.createElement('button');
            ytBtn.textContent = "Download YouTube Video (via yt-dlp)";
            ytBtn.onclick = () => {
                chrome.runtime.sendNativeMessage(
                    "com.ytdlp.extension",
                    { url: tab.url },
                    (response) => {
                        alert(response?.message || "Check Native Messaging setup!");
                        window.close();
                    }
                );
            };
            ytLi.appendChild(ytBtn);
            videoList.appendChild(ytLi);
        }

        if (!videosDetected) {
            noVideosMsg.style.display = 'block';
            noVideosMsg.textContent = "No videos detected on this site.";
        }
    });
});
