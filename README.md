# LLM-Powered Beer Distribution Game Website

## About

This website (https://infotheorylab.github.io/beer-game/) showcases research into how Large Language Models (LLMs) behave when controlling roles in the classic Beer Distribution Game - a supply chain simulation exercise. The project explores how AI agents manage inventory, orders, and the infamous "bullwhip effect" across different supply chain positions (retailer, wholesaler, distributor, factory).

The Beer Game is a well-known business simulation that demonstrates how small changes in customer demand can create massive amplification and instability as information travels upstream through a supply chain. This research investigates whether AI agents exhibit similar behaviors or can potentially mitigate these effects.

## Authors

- **Carol Long**
- **David Simchi-Levi** 
- **Andre du Pin Calmon**
- **Flavio du Pin Calmon**

## How to Run Locally

### Prerequisites
- Python 3.x installed on your system

### Step-by-Step Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory**
   ```bash
   cd beer-game.github.io
   ```

3. **Start a local web server**
   ```bash
   python -m http.server 8080
   ```
   
   *Note: On some systems, you may need to use `python3` instead of `python`*

4. **Open your web browser**
   - Navigate to: `http://localhost:8080`
   - **Best experienced on desktop** for optimal interactive features

5. **View the website**
   - The site features scroll-based interactions and animations
   - Use scroll or arrow keys to navigate between sections

## Technical Details

- **Pure vanilla HTML/CSS/JavaScript** - No build process required
- **JSON-based content management** - Easy content editing via `/content/content.en.json`
- **Interactive visualizations** - Chart.js for bullwhip effect demonstration
- **Responsive design** - Mobile-friendly with desktop optimizations
- **Snap-scroll navigation** - Full-height sections with smooth scrolling

## Project Status

🔄 **Active Development**: This website is being actively developed as part of ongoing research. Expect:

- Content updates and refinements
- New interactive features
- Design improvements
- Research findings integration

## Contact

For inquiries or collaboration opportunities, please reach out to the authors via email.

---

*This project represents ongoing academic research into AI behavior in supply chain management contexts.*
