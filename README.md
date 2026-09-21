<img width="1118" height="437" alt="upload" src="https://github.com/user-attachments/assets/6e97e3c6-db6f-4853-9e41-21f905a7b503" /><img width="1118" height="437" alt="upload" src="https://github.com/user-attachments/assets/9decd656-d829-4ea1-8fc9-ac2e462acdd9" /><img width="1466" height="252" alt="Developer mode" src="https://github.com/user-attachments/assets/7297f50a-e613-49f7-b956-8fc27407b03a" /><img width="236" height="144" alt="zip extracted" src="https://github.com/user-attachments/assets/094a6f35-8a76-4e9d-a860-54838fd55f9e" /># TDS — The Daily Stack

TDS is a daily task tracker built as a Chromium side-panel extension. It helps you remember what you need to complete today, if you complete any one of your task your streak will increase and heatmap will be green just like leetcode and github all of this without creating an account just an extension.

## Features

- Daily task tracking
- Activity-based streaks
- 112-day activity heatmap
- Separate task sets for weekdays and weekends
- Add and delete tasks
- Historical daily records
- Dark and light themes
- Data stored locally in your browser
- Lightweight Chromium side-panel extension

## Screenshots

### Daily Dashboard
<img width="419" height="773" alt="Dashboard" src="https://github.com/user-attachments/assets/9f2d10c6-bd77-436e-b501-f1bfdd5bf54b" />


### Task Tracking
<img width="392" height="235" alt="Tracking" src="https://github.com/user-attachments/assets/1aed46b4-18f7-4134-943e-658484a3e4f8" />

### Activity History
<img width="390" height="468" alt="history" src="https://github.com/user-attachments/assets/e17fdc24-cff8-405f-be56-42626d7e1d13" />

### Light Theme
<img width="411" height="719" alt="light_theme" src="https://github.com/user-attachments/assets/e6855cd7-9a4a-48eb-bed5-15dd9a4cbe19" />

## Installation

TDS is currently distributed manually through GitHub Releases.

1. Download the latest `tds-extension.zip` from the [Releases](../../releases) page.
2. Extract the ZIP file to a folder on your computer.
<img width="236" height="144" alt="zip extracted" src="https://github.com/user-attachments/assets/c445ff9e-1a4d-4c48-a900-ed99dccef7c7" />
3. In Chrome, Brave, or another Chromium-based browser, open `chrome://extensions`.
<img width="1466" height="252" alt="Developer mode" src="https://github.com/user-attachments/assets/08b6c4b6-dccf-47b3-a669-99e421b36e97" />
4. Turn on **Developer mode**.
5. Click **Load unpacked** and select the extracted TDS folder.
<img width="1118" height="437" alt="upload" src="https://github.com/user-attachments/assets/41bf2c8f-c71f-44b3-a38b-734a4c685cf6" />
6. Click the TDS icon in your browser toolbar to open The Daily Stack in the side panel.
<img width="1118" height="437" alt="upload" src="https://github.com/user-attachments/assets/543c172c-1e3b-432d-a6c3-63daba325c54" />


## Privacy

TDS does not require an account. All task data is stored locally using the browser's extension storage, and no personal data is sent to a server.

## Built With

- React
- TypeScript
- Vite
- Chrome Extension Manifest V3
- Chrome Storage API

## Project Structure

```text
daily-stack/
├── src/
├── public/
├── dist/
├── manifest.json
└── README.md
```
