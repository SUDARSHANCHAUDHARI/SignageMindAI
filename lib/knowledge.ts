import type { KnowledgeEntry } from './types'

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ── Generic signage device ────────────────────────────────────────────────
  {
    id: 'device-001',
    platform: 'Signage device',
    category: 'Crashes',
    title: 'Signage device app crash after content update',
    content: `Signage device apps can crash after a content update if the new content contains unsupported media formats or the app bundle is corrupted during download. Steps to resolve:
1. Check device logs via the signage provider dashboard
2. Verify the content URL is accessible from the device network
3. Force-stop the signage player app from device settings
4. Clear the signage player app cache from device settings
5. Re-push content from the signage provider CMS
6. If the issue persists, factory reset the signage device and re-enroll it`,
    tags: ['crash', 'signage device', 'app', 'content update', 'force stop', 'clear cache'],
  },
  {
    id: 'device-002',
    platform: 'Signage device',
    category: 'Updates',
    title: 'Signage device firmware update failure',
    content: `Signage device firmware update failures are commonly caused by insufficient disk space, network interruptions, or proxy interference. Resolution:
1. Ensure at least 2 GB free storage on device
2. Verify device has stable internet (>5 Mbps) during update window
3. Disable any content proxy that might intercept OTA traffic
4. Ensure the signage provider update endpoint is whitelisted
5. Check update logs at /data/logs/ota.log via ADB
6. Manual update: download firmware .zip from the signage provider support portal, then sideload via ADB:
   adb sideload firmware.zip`,
    tags: ['firmware', 'update', 'ota', 'signage device', 'disk space', 'adb'],
  },
  {
    id: 'device-003',
    platform: 'Signage device',
    category: 'Display',
    title: 'Signage device screen goes blank or black',
    content: `Screen blanking on signage devices usually occurs due to screensaver activation, HDMI handshake failure, or display power settings. Steps:
1. Disable screensaver: Settings → Display → Screen Timeout → Never
2. Check HDMI cable connection and try a different port
3. Verify display power management: Settings → Display → Sleep → Never
4. Enable "Stay Awake" in Developer Options (requires developer mode)
5. Check if content schedule has gap — empty schedule slots show black
6. Force wake: adb shell input keyevent KEYCODE_WAKEUP`,
    tags: ['black screen', 'blank', 'signage device', 'hdmi', 'screensaver', 'sleep', 'display'],
  },
  {
    id: 'device-004',
    platform: 'Signage device',
    category: 'Network',
    title: 'Signage device offline / not checking in',
    content: `Signage devices fail to check in when the signage provider cloud endpoint is unreachable. Diagnostics:
1. Ping the signage provider API endpoint from the device network
2. Ensure TCP port 443 (HTTPS) is open outbound
3. NTP sync required — ensure time.google.com:123 (UDP) is reachable
4. Check proxy: Settings → Network → Proxy. Remove if misconfigured
5. Re-register device through the signage provider pairing flow
6. Factory reset as last resort via Settings → System → Reset`,
    tags: ['offline', 'network', 'signage device', 'check in', 'api', 'proxy', 'ntp'],
  },

  // ── Windows ───────────────────────────────────────────────────────────────
  {
    id: 'win-001',
    platform: 'Windows',
    category: 'Performance',
    title: 'Windows signage player memory leak / high RAM usage',
    content: `Windows signage players accumulate memory over days of continuous operation. Mitigation:
1. Schedule daily restart via Task Scheduler:
   - Action: Start a program: shutdown.exe /r /t 0
   - Trigger: Daily at 3:00 AM
2. Configure automatic login after restart (netplwiz → uncheck password requirement)
3. Set player to launch on startup (Startup folder or registry Run key)
4. Enable Windows Update maintenance window at same off-peak time
5. Monitor with: Task Manager → Performance → Memory
6. Use Process Explorer (Sysinternals) to identify leaking process`,
    tags: ['memory', 'ram', 'leak', 'windows', 'restart', 'task scheduler', 'performance'],
  },
  {
    id: 'win-002',
    platform: 'Windows',
    category: 'Display',
    title: 'Windows DirectX / GPU crash causing black screen',
    content: `DirectX driver crashes (TDR — Timeout Detection and Recovery) cause brief black screen on Windows signage. Fix:
1. Update GPU drivers from manufacturer site (Intel/AMD/NVIDIA)
2. Increase TDR delay via registry (prevents premature driver kill):
   HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers
   TdrDelay = 8 (DWORD, default 2)
3. Disable GPU hardware acceleration in browser/player if hardware limited
4. Set power plan to High Performance: powercfg /setactive SCHEME_MIN
5. Disable Windows Error Reporting to prevent popups
6. Enable crash dump: Control Panel → System → Advanced → Startup and Recovery`,
    tags: ['directx', 'gpu', 'black screen', 'tdr', 'driver', 'windows', 'crash'],
  },
  {
    id: 'win-003',
    platform: 'Windows',
    category: 'Kiosk',
    title: 'Windows kiosk mode setup for signage',
    content: `Configure Windows in kiosk/assigned access mode for signage deployments:
1. Assigned Access (single app kiosk): Settings → Accounts → Family & other users → Set up a kiosk
2. Or via PowerShell:
   Set-AssignedAccess -AppUserModelId "Microsoft.MicrosoftEdge_8wekyb3d8bbwe!MicrosoftEdge" -UserName "Kiosk"
3. For multi-app kiosk (Windows 10 Enterprise/Education): use MDM XML profile
4. Disable all notifications: Settings → System → Notifications → Off
5. Hide taskbar: Taskbar Settings → Automatically hide taskbar
6. Prevent Explorer restart loops: set shell in registry to your player executable`,
    tags: ['kiosk', 'assigned access', 'windows', 'single app', 'lock down'],
  },

  // ── FireOS ────────────────────────────────────────────────────────────────
  {
    id: 'fire-001',
    platform: 'FireOS',
    category: 'Sideloading',
    title: 'Sideloading apps on Amazon Fire TV / Fire Stick',
    content: `Sideloading signage apps on FireOS devices:
1. Enable Developer Options: Settings → My Fire TV → About → Click "Build" 7 times
2. Enable ADB Debugging: Settings → My Fire TV → Developer Options → ADB Debugging → ON
3. Enable Apps from Unknown Sources: same Developer Options menu
4. Get device IP: Settings → My Fire TV → About → Network
5. Connect ADB: adb connect <device-ip>:5555
6. Install APK: adb install -r signage-player.apk
7. Launch: adb shell am start -n com.your.package/.MainActivity
8. Auto-launch on boot: use a launcher app or ADB Binder to set as default home`,
    tags: ['sideload', 'apk', 'adb', 'fire tv', 'fire stick', 'fireos', 'developer options'],
  },
  {
    id: 'fire-002',
    platform: 'FireOS',
    category: 'Display',
    title: 'FireOS display rotation and resolution issues',
    content: `FireOS display problems on commercial signage deployments:
1. Force portrait mode via ADB: adb shell settings put system user_rotation 1
   (0=landscape, 1=portrait, 2=reverse landscape, 3=reverse portrait)
2. Set resolution: adb shell wm size 1920x1080
3. Set DPI: adb shell wm density 160
4. Disable auto-rotate lock: adb shell settings put system accelerometer_rotation 0
5. For persistent rotation across reboots, use an init.d script or launcher
6. HDMI-CEC can override resolution — disable in TV settings or via: adb shell setprop persist.sys.hdmi.cec.enabled false`,
    tags: ['rotation', 'portrait', 'resolution', 'fireos', 'adb', 'hdmi-cec', 'display'],
  },
  {
    id: 'fire-003',
    platform: 'FireOS',
    category: 'Network',
    title: 'FireOS app not connecting / VPN / proxy issues',
    content: `FireOS network configuration for enterprise signage:
1. FireOS does not support system-level HTTP proxy natively — use transparent proxy at network level
2. For corporate Wi-Fi (802.1X/WPA2-Enterprise): ADB configure network via WiFiManager intent
3. Disable Amazon services to reduce bandwidth: Developer Options → Disable OTA Updates
4. Keep alive: use adb shell setprop persist.log.tag.ConnectivityService SUPPRESS to reduce reconnection logs
5. Static IP: Settings → Wi-Fi → Long press network → Modify → Static
6. Firewall: allow traffic to amazonaws.com for app downloads if sideloading via Amazon`,
    tags: ['network', 'proxy', 'wifi', 'fireos', 'enterprise', '802.1x', 'connectivity'],
  },

  // ── Tizen ─────────────────────────────────────────────────────────────────
  {
    id: 'tizen-001',
    platform: 'Tizen',
    category: 'Deployment',
    title: 'Deploying web apps to Samsung Tizen displays (SSSP)',
    content: `Deploying web signage apps to Samsung Tizen displays via SSSP (Smart Signage Platform):
1. Build web app as a .wgt package using Tizen Studio
2. Set content source via URL Launcher (simpler, no package needed):
   MagicInfo → Settings → URL Launcher → Enter your hosted URL
3. For MagicInfo Server deployment:
   - Upload .wgt via MagicInfo Server web interface
   - Assign to device group
4. Enable Developer Mode on display:
   Home → Apps → Enable Developer Mode → enter IP of development machine
5. Deploy via CLI: tizen install --name app.wgt --serial <device-serial>
6. Auto-start: Settings → General → On/Off Timer → Power On Source: URL Launcher`,
    tags: ['tizen', 'samsung', 'sssp', 'wgt', 'magicinfo', 'url launcher', 'deploy'],
  },
  {
    id: 'tizen-002',
    platform: 'Tizen',
    category: 'Display',
    title: 'Samsung Tizen display settings and orientation',
    content: `Samsung commercial display (QM/QP/QE series) configuration:
1. Enter settings: Home button → PIN (default: 0000)
2. Set display orientation: Menu → Picture → Display Orientation → Portrait/Landscape
3. Disable power saving: Menu → System → ECO Solution → All OFF
4. Auto power on: Menu → System → Auto Power On → On
5. Disable OSD notifications: Menu → System → OSD Display → Source OSD → Off
6. Set input source: Menu → Source → Display Port / HDMI / Internal (for web app)
7. Lock settings: Menu → System → Safety Lock On (PIN: 0000 default)
8. Factory reset: Menu → Support → Self Diagnosis → Reset`,
    tags: ['tizen', 'samsung', 'display settings', 'orientation', 'portrait', 'auto power'],
  },
  {
    id: 'tizen-003',
    platform: 'Tizen',
    category: 'Crashes',
    title: 'Tizen web app crashes / white screen / infinite load',
    content: `Tizen web app stability issues:
1. White screen = JavaScript error on startup — check console via remote debugging:
   Enable: Developer Mode → Enter dev machine IP → Inspect via Chrome DevTools → chrome://inspect
2. Memory limit on Tizen 4.0+: ~256 MB per app. Avoid large images/videos in DOM
3. Tizen WebKit is older — avoid ES2020+ features without transpilation
4. Crash recovery: Settings → General → Reset System → App Recovery
5. Clear app data: Home → Apps → Long press → Clear Data
6. Infinite load = network timeout. Check: tizen.systeminfo.getPropertyValue("NETWORK")
7. Deploy with legacy JS target in Tizen Studio: Project → Build Configurations → edit config.xml → Required Version = 4.0`,
    tags: ['tizen', 'crash', 'white screen', 'javascript', 'memory', 'debugging', 'webkit'],
  },

  // ── webOS ─────────────────────────────────────────────────────────────────
  {
    id: 'webos-001',
    platform: 'webOS',
    category: 'Deployment',
    title: 'LG webOS Signage app installation',
    content: `Deploying apps to LG webOS Signage displays:
1. Package app as .ipk using webOS OSE CLI:
   npm install -g @webosose/ares-cli
   ares-package ./app -o ./output
2. Set up device target:
   ares-setup-device --add mydevice --info "{\"host\":\"<IP>\",\"port\":9922,\"username\":\"root\"}"
3. Install: ares-install --device mydevice ./app.ipk
4. Launch: ares-launch --device mydevice com.your.appid
5. For SuperSign (LG CMS): upload .ipk via SuperSign Web Manager → Contents → Add
6. Set as default app: SuperSign → Device → Basic Settings → SI Server URL or App launch
7. Inspect: ares-inspect --device mydevice --app com.your.appid`,
    tags: ['webos', 'lg', 'ipk', 'ares-cli', 'supersign', 'install', 'deploy'],
  },
  {
    id: 'webos-002',
    platform: 'webOS',
    category: 'Display',
    title: 'LG webOS display configuration and power management',
    content: `LG commercial display configuration for signage (BU/UM/UH series):
1. Access hotel/installer menu: press Menu + 1 + 1 + 0 + 8 + OK
2. Set SMART mode to Digital Signage: Installer Menu → SI_CONTROL_MODE → 1
3. Auto-power: Installation Menu → Auto Power On → On
4. Orientation: Installation Menu → OSD Rotation → 90/270 for portrait
5. Disable energy saving: Settings → Picture → Energy Saving → Off
6. Disable screen saver: Settings → General → Screen Saver → Off
7. Prevent remote control by users: Lock remote: Settings → Lock → TV Rating → Lock
8. Factory reset: Settings → General → Reset to Initial Settings`,
    tags: ['webos', 'lg', 'display', 'portrait', 'auto power', 'energy saving', 'digital signage'],
  },
  {
    id: 'webos-003',
    platform: 'webOS',
    category: 'Crashes',
    title: 'LG webOS app crashes and JavaScript errors',
    content: `LG webOS app crash diagnosis:
1. Enable developer mode: webOS Signage Developer Mode app → Enable Dev Mode
2. Remote debug: ares-inspect --device mydevice --app com.appid → Chrome DevTools
3. webOS uses Blink engine (Chromium 38 in older models, 72+ in recent) — check compatibility
4. Memory: webOS allocates ~256 MB per app. Monitor via: luna-send -n 1 luna://com.webos.service.memorymanager/getManagerEvent {}
5. App stuck: kill via ares-launch --device mydevice --close com.your.appid
6. System logs: journalctl -u surface on device via SSH (root@<ip>, port 9922)
7. Common crash: window.crypto.subtle not available in older webOS — polyfill required`,
    tags: ['webos', 'crash', 'debug', 'javascript', 'memory', 'chromium', 'luna'],
  },

  // ── Iframe ────────────────────────────────────────────────────────────────
  {
    id: 'iframe-001',
    platform: 'Iframe',
    category: 'Security Headers',
    title: 'X-Frame-Options blocking iframe embedding',
    content: `X-Frame-Options header prevents a URL from being embedded in iframes. Common values:
- DENY: cannot be framed by any page
- SAMEORIGIN: can only be framed by same origin
- ALLOW-FROM uri: (deprecated, ignored by modern browsers)

Resolution options:
1. Ask site owner to remove or change to SAMEORIGIN if you control the signage domain
2. Use a server-side proxy: your signage server fetches the URL and strips the header
   Example nginx: proxy_hide_header X-Frame-Options;
3. Use the signage provider URL app which renders URLs in kiosk mode (not iframe)
4. Capture static screenshot of the URL and display as image instead
5. For your own sites: set X-Frame-Options: ALLOW-FROM or remove header entirely`,
    tags: ['iframe', 'x-frame-options', 'deny', 'sameorigin', 'embed', 'block', 'header'],
  },
  {
    id: 'iframe-002',
    platform: 'Iframe',
    category: 'Security Headers',
    title: 'CSP frame-ancestors blocking iframe embedding',
    content: `Content Security Policy frame-ancestors directive controls which origins can embed the page. It supersedes X-Frame-Options in modern browsers.

Common blocking values:
- frame-ancestors 'none': no embedding allowed (equivalent to X-Frame-Options: DENY)
- frame-ancestors 'self': only same origin
- frame-ancestors https://allowed.com: only specific domain

Resolution:
1. Ask site owner to add your signage player domain:
   Content-Security-Policy: frame-ancestors 'self' https://player.yoursignage.com
2. Server-side proxy to strip CSP header (nginx: proxy_hide_header Content-Security-Policy)
3. Use browser extension or Electron-based kiosk app that ignores CSP
4. For some signage providers: players may run in kiosk mode bypassing iframe restrictions`,
    tags: ['iframe', 'csp', 'content-security-policy', 'frame-ancestors', 'block', 'embed'],
  },
  {
    id: 'iframe-003',
    platform: 'Iframe',
    category: 'Mixed Content',
    title: 'Mixed content warning in signage iframe',
    content: `Mixed content occurs when an HTTPS signage player loads an HTTP iframe URL.

Browsers block "active" mixed content (scripts, iframes) by default since Chrome 86+.

Resolution:
1. Use HTTPS version of the URL — most sites support it
2. If HTTP-only: set up a reverse proxy on your HTTPS server:
   nginx: proxy_pass http://target-url;
3. Enable HTTP in the signage provider app configuration if the player supports it
4. For local network resources (HTTP dashboards on LAN): use a local HTTPS proxy
5. Check if site has HSTS — if so, HTTP version won't work at all
6. Signage players on local network can sometimes be configured to allow HTTP content`,
    tags: ['iframe', 'mixed content', 'https', 'http', 'block', 'chrome', 'browser'],
  },
  {
    id: 'iframe-004',
    platform: 'Iframe',
    category: 'Auth',
    title: 'Iframe URL shows login wall / authentication required',
    content: `URLs protected by authentication (SSO, OAuth, basic auth) show a login page inside the iframe.

Signs of auth wall: HTTP 401/403 status, redirect to login page, SAML assertion error.

Resolution:
1. Use a service account / API key to pre-authenticate and generate a public embed URL
2. For Google services (Data Studio, Sheets): publish to web → Share → Anyone with link
3. For internal dashboards: create a read-only public view or embed token
4. Grafana: create an anonymous viewer org or use Grafana "share panel" with embed link
5. Power BI: use "Publish to web" to get public embed URL (no auth required)
6. Tableau: use Tableau Public or server embedding with JWT token in URL params
7. As last resort: schedule a screenshot script that logs in and captures the page`,
    tags: ['iframe', 'auth', 'login', 'sso', 'oauth', '401', '403', 'grafana', 'power bi', 'tableau'],
  },
  {
    id: 'iframe-005',
    platform: 'Iframe',
    category: 'Debugging',
    title: 'Diagnosing why a URL will not load in signage iframe',
    content: `Step-by-step iframe compatibility diagnosis:

1. Check HTTP headers with curl:
   curl -I https://example.com
   Look for: X-Frame-Options, Content-Security-Policy headers

2. Test in browser DevTools:
   Open URL in tab → F12 → Console → look for "Refused to display" errors
   Network tab → check response headers on main document request

3. Verify HTTPS: HTTP URLs are blocked by most HTTPS signage players

4. Check auth: does the URL redirect to a login page?
   curl -L -I https://example.com → follow redirects, final URL and status

5. Test iframe directly: create test HTML with <iframe src="URL"> and open in browser

6. Check CORS for embedded APIs (different from iframe but often confused)

7. Use SignageQA MCP tool: check_iframe_compatibility → instant header analysis`,
    tags: ['iframe', 'debug', 'diagnose', 'curl', 'devtools', 'refused to display', 'headers'],
  },

  // ── General ────────────────────────────────────────────────────────────────
  {
    id: 'gen-001',
    platform: 'General',
    category: 'Content',
    title: 'Supported media formats for digital signage',
    content: `Standard supported media formats across signage platforms:

Video: MP4 (H.264/H.265), WebM (VP8/VP9), MOV (H.264)
- H.264 has broadest hardware decode support
- H.265/HEVC requires hardware decoder — check platform spec
- Recommended: 1920x1080 @ 30fps, CBR, max 20 Mbps

Images: JPEG, PNG, GIF, WebP, SVG
- Max resolution varies: typically 4096x4096
- Animated GIFs are CPU-intensive — prefer video for animations

Web/HTML: HTML5 apps, URL apps — iframe compatibility required
- JavaScript runtime: Chromium/WebKit depending on platform

Audio: AAC, MP3, OGG (for web apps)

Not supported universally: HEIC, AVIF, AV1 video (Tizen/webOS may not support)`,
    tags: ['media', 'format', 'mp4', 'h264', 'image', 'video', 'supported', 'codec'],
  },
  {
    id: 'gen-002',
    platform: 'General',
    category: 'Network',
    title: 'Network requirements for digital signage players',
    content: `Minimum network requirements for signage players:

Bandwidth:
- Management/check-in: 1 Mbps sustained
- HD video streaming: 10-20 Mbps per player
- 4K video: 40+ Mbps
- Static content (images, HTML): 5 Mbps

Ports to whitelist (outbound):
- TCP 443: HTTPS (management, content CDN)
- TCP 80: HTTP (initial redirects)
- UDP 123: NTP (time sync — critical for certificate validation)
- TCP 8883: MQTT (some CMS platforms)

DNS: Ensure reliable DNS resolution — use 8.8.8.8 as backup
Latency: <100ms to CMS server recommended
WiFi: 5 GHz preferred over 2.4 GHz for stability

Common issue: certificate validation fails when NTP is broken → clocks out of sync → HTTPS fails`,
    tags: ['network', 'bandwidth', 'ports', 'firewall', 'ntp', 'dns', 'wifi', 'https'],
  },
  {
    id: 'gen-003',
    platform: 'General',
    category: 'Troubleshooting',
    title: 'Device not showing content / stuck on loading screen',
    content: `Universal troubleshooting for signage devices stuck loading:

1. Check internet connectivity: can device ping 8.8.8.8?
2. Check time sync: wrong time = SSL cert validation failure = HTTPS blocked
3. Check CMS status page for outages
4. Check content URL: is it accessible publicly?
5. Check content format: is the file format supported on this platform?
6. Clear app cache (platform-specific)
7. Check disk space: full disk = cannot download content
8. Restart app (soft): via CMS remote command or ADB
9. Restart device: power cycle
10. Re-register device: unregister → factory reset → re-pair

Log files to collect for support:
- Signage device: signage provider dashboard logs
- Android/FireOS: adb logcat -s <player-process>
- Windows: %AppData%/<player-name>/logs/
- Tizen: remote debug console
- webOS: SSH journalctl`,
    tags: ['loading', 'stuck', 'blank', 'troubleshoot', 'cache', 'disk space', 'restart', 'logs'],
  },
]
