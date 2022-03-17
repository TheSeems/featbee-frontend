import './App.css';
import StarRating from "./components/StarRating";

export const apiUrl = "https://featbee.theseems.ru/api";
export const captcha = {
    enabled: false,
    sitekey: "your-sitekey-here"
}

function App() {
    return (
        <div className="App">
            <StarRating/>
        </div>
    );
}

export default App;
