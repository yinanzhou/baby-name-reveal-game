# Baby Name Reveal Game (Wordle Style)

**[View Repository](https://github.com/yinanzhou/baby-name-reveal-game)** | **[Live Deployment](https://baby-name-reveal.yyzz.dev/)**

With the Baby Name Reveal Game, you can host an interactive name-guessing game at your baby shower. It helps you reveal your baby's name in a fun, Wordle-like style!

## Disclaimer

This is not an officially supported Google product. This project is not
eligible for the [Google Open Source Software Vulnerability Rewards
Program](https://bughunters.google.com/open-source-security).

## Features

*   **Two Game Modes**:
    *   **Auto Mode**: Plays like Wordle. Enter a guess and the game automatically colors the tiles based on a pre-programmed answer.
    *   **Manual Mode**: Allows the host to manually color the tiles using a palette (White, Green, Yellow) to reveal the name step-by-step or play with custom rules.
*   **Customizable**:
    *   Set your own event title (e.g., "John & Ana's Baby Shower").
    *   Add an optional suffix (e.g., the baby's last name).
    *   Adjust the number of starting tiles.
*   **Themes**: Choose between Boy (Blue), Girl (Pink), and Neutral (Green) themes to match your shower.
*   **Snapshots**: Keep track of previous guesses by taking snapshots.
*   **Full Screen Support**: Great for projecting on a screen or TV during the event.
*   **Responsive Design**: Works well on desktop and mobile devices.
*   **Persistence**: Option to remember settings in browser local storage (opt-in).

## Technical Architecture

This project is designed for zero-dependency deployment and ease of use.

*   **File Structure**: Public files are located in the `public` directory. HTML, CSS, and JavaScript are separated into `index.html`, `style.css`, and `script.js`.
*   **State Management**: Game state and configuration are managed in-memory via a simple JavaScript object in `public/script.js`.
*   **Styling**: Uses CSS variables in `public/style.css` for theming.

### Security & CSP

This application enforces a strict Content Security Policy (CSP) to ensure security and privacy. The policy is defined in `public/_headers` (supported by platforms like Netlify).

*   **No Inline Scripts/Styles**: The CSP forbids unsafe inline scripts and styles. All JavaScript is in `script.js` and all CSS in `style.css`.
*   **Zero External Requests**: The application does not load any external resources. Everything is self-contained.

### Mobile Experience

To maintain the game board layout without complex media queries, the application forces a desktop-like experience on mobile devices. This is achieved by setting the viewport width to `1280` in `index.html`. Mobile browsers will render the page as if it were on a desktop and scale it down to fit the screen.

## Directory Structure

```text
.
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── public/
    ├── 404.html
    ├── _headers
    ├── index.html
    ├── script.js
    └── style.css
```

## Prerequisites

Before using this project, you need:
*   A modern web browser (e.g., Chrome, Firefox, Safari, Edge).

## Local Development

Since this is a client-side application built with pure HTML, CSS, and JavaScript, no build steps are required!

### Running Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/yinanzhou/baby-name-reveal-game.git
    cd baby-name-reveal-game
    ```
2.  Open `public/index.html` directly in your browser, or use a local development server for a better experience:
    *   **Using Python**: `cd public && python3 -m http.server 8000`
    *   **Using Node.js**: `npx serve public`

Open your browser and navigate to the address provided by the server (usually `http://localhost:8000`).

## How to Play / Configure

1.  Click the gear icon (⚙️) to open the configuration menu.
2.  Set the event title, theme, and game mode.
3.  If using **Auto Mode**, enter the secret name in the "Answer" field.
4.  Click "Apply" to save settings and reset the board.
5.  Start guessing!
    *   In **Auto Mode**, type letters and press Enter to see if they are correct (Green) or present in the name but in the wrong spot (Yellow).
    *   In **Manual Mode**, type letters and click on tiles to change their colors using the palette at the bottom.
6.  Use the camera icon (📸) to save a snapshot of the current state.
7.  Use the plus (➕) and minus (➖) buttons to add or remove letter slots (available in Manual mode).

## Configuration & Customization

### Code Configuration

You can pre-configure the game by editing the `config` object at the top of `public/script.js`:

```javascript
let config = {
  title: "John & Ana's Baby Shower",
  theme: "boy", // 'boy', 'girl', or 'neutral'
  suffix: "Smith",
  mode: "auto", // 'auto' or 'manual'
  answer: "BABY",
  initialTiles: 5,
  maxSnapshots: 1
};
```

### Styling (CSS Variables)

The design system is controlled via CSS variables in the `:root` selector. You can easily customize the palette by overriding these variables:

```css
:root {
  --bg-color: #e3f2fd;
  --primary-blue: #1565c0;
  --color-correct: #6aaa64;
  --color-present: #c9b458;
}
```

### Local Storage Persistence

You can opt-in to remember your settings in the browser's local storage by checking the "Remember settings" option in the configuration menu. This ensures your settings are preserved across page reloads.

*   **Privacy**: Settings are stored entirely in your browser. No data is transmitted to any server.
*   **Opt-out**: If you uncheck the option, stored settings will be cleared.
*   **Leak Prevention**: If a valid configuration is found in local storage on startup, the configuration menu will be hidden automatically to prevent accidentally revealing the answer to the audience.

## Technologies Used

*   HTML5
*   CSS3 (with theme support)
*   Vanilla JavaScript

## Help and Support

If you encounter any issues or have suggestions, please open an issue on the repository issue tracker.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit a Pull Request.

## License

You are free to copy, modify, and distribute this project under the terms of the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

