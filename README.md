<p align="center">
  <img alt="Made With Python" src="https://img.shields.io/badge/Made%20with-Python-3776AB?style=for-the-badge&logo=python&logoColor=white">
  <img alt="Chrome Extension" src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white">
  <img alt="yt-dlp" src="https://img.shields.io/badge/Powered%20by-yt--dlp-yellowgreen?style=for-the-badge">
</p>


📥 Universal Video Downloader
Universal Video Downloader is a Chrome extension that detects and downloads videos (including streams) from any webpage — with full support for YouTube and YouTube Shorts via yt-dlp integration through Native Messaging.

✅ Download MP4, WebM, HLS streams, and more
✅ Special support for YouTube videos and Shorts (audio/video merged to MP4)
✅ No external websites or shady downloaders needed
✅ Private, local — you own your downloads

✨ Features
Detects embedded video URLs (.mp4, .webm, .ogg, .m3u8, .mpd) on most websites.

Adds download buttons automatically for detected videos.

Special button for YouTube videos and Shorts that triggers local yt-dlp to download highest-quality video/audio merged as MP4.

Downloads directly to your computer's Downloads folder.

Lightweight and privacy-focused — no analytics, no tracking.

📦 Installation
1. Install yt-dlp
You must have yt-dlp installed on your machine:

bash
Copy
Edit
pip install yt-dlp
Verify installation:

bash
Copy
Edit
yt-dlp --version
2. Install Python 3 (if not already installed)
Native messaging uses a Python script to trigger yt-dlp downloads.

⚙️ Setup (Native Messaging Host)
Native messaging is used to let Chrome Extensions talk to your computer's local programs (like Python).

Windows Setup
Create these files:

File	Purpose
yt_dlp_host.py	Python script to handle download requests
com.ytdlp.extension.json	Native messaging host manifest

Python Script (yt_dlp_host.py)

This script receives URLs from Chrome and launches yt-dlp:

python
Copy
Edit
import sys, json, struct, subprocess, os

def send_message(message):
    encoded = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('I', len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()

def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        sys.exit(0)
    message_length = struct.unpack('I', raw_length)[0]
    return json.loads(sys.stdin.buffer.read(message_length))

while True:
    try:
        msg = read_message()
        url = msg.get("url")
        if url:
            download_dir = os.path.expanduser("~/Downloads")
            subprocess.run([
                "yt-dlp", "-f", "bestvideo+bestaudio",
                "--merge-output-format", "mp4",
                "-o", f"{download_dir}/%(title)s.%(ext)s",
                url
            ], check=True)
            send_message({"status": "success", "message": "Download completed!"})
        else:
            send_message({"status": "error", "message": "No URL provided."})
    except subprocess.CalledProcessError as e:
        send_message({"status": "error", "message": f"yt-dlp error: {e}"})
    except Exception as e:
        send_message({"status": "error", "message": str(e)})
Save it somewhere like:

makefile
Copy
Edit
C:\native_messaging\yt_dlp_host.py
Manifest File (com.ytdlp.extension.json)

Example contents:

json
Copy
Edit
{
  "name": "com.ytdlp.extension",
  "description": "Native messaging host for yt-dlp",
  "path": "C:\\native_messaging\\yt_dlp_host.py",
  "type": "stdio",
  "allowed_origins": ["chrome-extension://<YOUR_EXTENSION_ID>/"]
}
Replace <YOUR_EXTENSION_ID> with your extension ID from chrome://extensions.

Save this manifest at:

pgsql
Copy
Edit
C:\native_messaging\com.ytdlp.extension.json
Register Native Messaging Host

Use Windows Registry Editor (regedit.exe):

Create a key:

pgsql
Copy
Edit
HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\com.ytdlp.extension
Set its (Default) value to:

pgsql
Copy
Edit
C:\native_messaging\com.ytdlp.extension.json
✅ Done! Native messaging is ready.

🚀 Load the Extension in Chrome
Go to chrome://extensions

Enable Developer Mode (top right).

Click Load Unpacked.

Select your project folder (where manifest.json is located).

Reload the extension anytime you update code.

🖥 Usage
Navigate to any webpage with embedded videos.

Click the extension icon.

Download detected videos directly.

On YouTube (including Shorts):

Click the "Download YouTube Video (via yt-dlp)" button.

The video (and audio) will be downloaded in high quality and saved as an MP4 file in your Downloads folder.

📄 Project Structure
bash
Copy
Edit
UniversalVideoDownloader/
│
├── background.js          # Detects video links
├── popup.js                # Handles popup UI and download logic
├── popup.html              # Basic popup layout
├── contentScript.js        # (optional) can be used for future DOM scanning
├── manifest.json           # Chrome Extension manifest
│
├── yt_dlp_host.py          # Python Native Messaging Host
├── com.ytdlp.extension.json # Native Messaging Manifest
└── README.md               # This file
❗ Troubleshooting
Problem	Solution
Native Messaging Host Not Found	Verify registry and manifest paths carefully.
yt-dlp command fails	Install yt-dlp globally (pip install yt-dlp).
Downloads don't start	Open Chrome console (Inspect popup or background page) and check for errors.
"Check Native Messaging setup!" popup	Likely incorrect registry, manifest, or Python error. Double-check.
Button shows but no download happens on YouTube Shorts	Make sure URL matching includes /shorts/. Already handled in this extension.

🛡 Disclaimer
This project is for educational purposes.
Downloading copyrighted content may violate YouTube’s Terms of Service or other site terms.
Use responsibly and only download content you have rights to.

🛠️ Built With
yt-dlp - YouTube and video downloader CLI

Chrome Extensions (Manifest V3)

Python 3 Native Messaging Bridge

📫 Contributing
Pull requests are welcome!
Open an issue if you find a bug or want a new feature.

🔥 Final Notes
Works best for personal video collection downloads.

Future versions may include automatic format/quality selection.

📜 License
Creative Commons License.
Feel free to fork, use, and modify. Credit appreciated but not required.

