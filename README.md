# PinUp Gallery – VS Code Extension

A Visual Studio Code extension that lets you browse an image gallery inside the
sidebar, drag & drop images into the editor, and **pin** selected images into
their own persistent windows for quick access.

> **Note**  
> Made for lulz and real men. Or senior devs in stockings. Or any other internet
> citizen group (women, non-binary, hex).  
> **Not actual NSFW, but not for kids. You are warned!**

---

## ✨ Features

- **Gallery View**  
  Browse images stored in the extension’s `media/` folder, grouped by category.

- **Drag & Drop**  
  Drag an image directly into an editor tab to insert a Markdown snippet or a
  plain URI.

- **Pin Images**  
  Click a thumbnail to open a dedicated panel for that image.  
  Pinned panels are remembered across VS Code restarts.

- **Automatic Media Discovery**  
  Files inside the `media/` folder are grouped automatically by name prefix
  (`beauty_`, `senior_`, `true_`, etc.).  
  Add a file with the right prefix and it appears in the gallery next time the
  extension is activated.

---

## 📂 Folder Structure
```
your-extension/
├─ media/                 # Images used in the gallery
│   ├─ beauty_.png
│   ├─ senior_.png
│   └─ true_*.png
├─ templates/
│   └─ index.html         # Webview template for the gallery
├─ src/
│   └─ extension.ts       # Extension entry point
└─ package.json           # VS Code extension manifest
```
---

## 🚀 Usage

1. **Install**  
   Clone this repository and run:
   ```bash
   npm install
   npm run compile
2. Just download it from extensions in VS Code and use it.
