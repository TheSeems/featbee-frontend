import './App.css';
import StarRating from "./components/StarRating";
import Feed from "./components/Feed";
import {useState} from "react";


// Relpace this with your backend API url
export const apiUrl = "https://featbee.theseems.ru/api";
export const captcha = {
    enabled: false,
    sitekey: "your-site-key"
}

function App() {

    const [score, setScore] = useState(null)
    const [visibility, setVisibility] = useState(Visibility.PRIVATE)
    const [content, setContent] = useState(null)
    return (
        <div className="App">
            <StarRating
                score={score} setScore={setScore}
                visibility={visibility} setVisibility={setVisibility}
                content={content} setContent={setContent}/>

            <div className="mt-12">
                <h1 className={"font-bold text-3xl"}>Public feedbacks</h1>
                <div className="mt-3">
                    <Feed
                        score={score} setScore={setScore}
                        visibility={visibility} setVisibility={setVisibility}
                        content={content} setContent={setContent}
                    />
                </div>
            </div>
        </div>
    );
}

export const Visibility = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
}
export default App;
