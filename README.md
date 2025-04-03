---

# 🦊 UA-Switcher  

UA-Switcher is a lightweight and customizable Chrome extension that allows you to easily switch between multiple User-Agent strings from a pre-defined list (`wordlist.txt`) or enter your own custom string.  

Whether you're testing how a website behaves on different devices or bypassing content filters, UA-Switcher makes it simple.  

---

## 🔧 Features  

✔️ Load User-Agent strings from a `wordlist.txt` file  
✔️ Dropdown menu for quick selection  
✔️ Custom User-Agent input field  
✔️ Reset to default User-Agent anytime  
✔️ Automatically refreshes all browser tabs when UA is applied  
✔️ Simple, clean UI with preset and custom tab switcher  

---

## 📦 Installation  

1️⃣ Clone or download this repository:  

```bash
git clone https://github.com/ThatNotEasy/UA-Switcher.git
```

2️⃣ Open **Google Chrome** and visit:  

```
chrome://extensions
```

3️⃣ Enable **Developer Mode** (top right corner).  

4️⃣ Click **Load unpacked** and select the `UA-Switcher` folder.  

5️⃣ The extension is now ready to use from the Chrome toolbar! 🚀  

---

## 📄 `wordlist.txt` Format  

- Each **User-Agent string** should be on a new line.  
- Lines starting with `#` are **ignored as comments**.  

**Example:**  

```plaintext
# Desktop Browsers
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ...

# Mobile Browsers
Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) ...
```

---

## 📁 File Structure  

```bash
├── background.js        # Sets UA rules using Chrome declarativeNetRequest
├── popup.html           # User interface
├── popup.js             # Logic for loading UAs and applying changes
├── manifest.json        # Chrome extension manifest
├── wordlist.txt         # Your list of User-Agents
```

---

## 💡 Use Cases  

🔹 **Web development & QA testing** – Test websites on different devices & browsers  
🔹 **Mobile/desktop compatibility checks** – See how sites behave on various platforms  
🔹 **Bypass content filters** – Trick websites that block certain browsers/devices  
🔹 **Basic browser fingerprint obfuscation** – Reduce tracking risks  

---

## 🛠 To-Do / Planned Features  

🚀 **Save last selected UA across sessions**  
🔄 **Auto-rotate User-Agents**  
🌍 **Domain-specific User-Agent rules**  
📤 **Export/import settings**  

---

## 📬 Contributions  

Pull requests and suggestions are welcome! Feel free to **fork** and improve the extension.  

---

## 🧑‍💻 Author  

Made with ❤️ by **[@ThatNotEasy](https://github.com/ThatNotEasy)**  

---