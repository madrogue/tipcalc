# Tip Calculator App

This is a standalone offline web app designed for iPhone that calculates tips based on a user-entered amount. The app features a touch-friendly scrolling dial for selecting the tip percentage and displays the calculated tip amount, effective tip percentage, and total.

## Project Structure

```
tip-calculator-app
├── src
│   ├── index.html       # Main HTML document for the app
│   ├── app.js           # JavaScript logic for calculations and user interactions
│   ├── styles.css       # CSS styles for layout and design
│   └── service-worker.js # Service worker for offline capabilities
├── manifest.json        # Metadata for the web app
└── README.md            # Project documentation
```

## Features

- Input field for entering the bill amount.
- Touch-friendly scrolling dial for selecting the tip percentage.
- Options for calculating tips:
  - Exact tip
  - Round tip up
  - Round tip down
  - Round total up
  - Round total down
- Displays:
  - Tip amount
  - Effective tip percentage
  - Total amount

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd tip-calculator-app
   ```

3. Open `src/index.html` in a web browser to view the app.

## Usage

- Enter the bill amount in the designated input field.
- Use the scrolling dial to select the desired tip percentage.
- Choose the preferred tip calculation option.
- The app will display the calculated tip amount, effective tip percentage, and total amount.

## Dependencies

This project does not have any external dependencies. It uses standard HTML, CSS, and JavaScript.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.