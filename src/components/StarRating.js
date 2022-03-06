import React, {useEffect, useState} from "react";
import toast, {Toaster} from "react-hot-toast";

async function sendRating(rating, content, setRating, setContent) {
    const promise = fetch("https://thrut.theseems.ru/api", {
        method: 'POST',
        body: JSON.stringify({
            "score": rating,
            "content": content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.json()
    }).then((result) => {
        console.log(result)
        if (result.success === false) {
            return Promise.reject("Failure: " + result)
        }

        setRating(result.score)
        setContent(result.content)
    });

    toast.promise(promise, {
        loading: 'Sending feedback',
        success: 'Your feedback has been saved',
        error: 'Error saving feedback'
    })
}

async function fetchRating(setRating, setContent) {
    return fetch("https://thrut.theseems.ru/api", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.json()
    }).then((result) => {
        console.log(result)
        if (result.success === false) {
            console.error(result)
            return null
        }

        setRating(result.score)
        setContent(result.content)
        return result
    }).catch((failure) => {
        console.error(failure)
    })
}

const StarRating = () => {
    const [rating, setRating] = useState();
    const [content, setContent] = useState();

    useEffect(() => {
        async function fetch() {
            return await fetchRating(setRating, setContent)
        }

        fetch().then(r => {
            if (r.success !== false) {
                toast("Fetched feedback", {
                    duration: 1000,
                    icon: '👁️‍🗨️'
                })
            }
        })
    }, [])

    function handleChanges(value) {
        setContent(value.target.value)
    }

    return (
        <div
            className={"mt-10 border transition duration-150 ease-in-out focus-within:border-primary border-gray-gray4  p-8 rounded-lg max-w-prose mx-auto"}>
            <div><Toaster/></div>

            <div>
                <label
                    htmlFor={"content"}
                    className={`text-xs text-primary font-light placeholder-gray-gray4 px-2 pt-1.5 cr-only`}
                    hidden
                >
                    Feedback
                </label>
                <textarea
                    className={`
                    w-full px-2 pb-1.5 text-primary outline-none text-base font-light rounded-md
                    `}
                    id={"content"}
                    placeholder={"Your feedback"}
                    rows={3}
                    value={content} onChange={handleChanges}
                />

                <ul className="flex items-center gap-x-1">
                    {[...Array(10)].map((star, index) => {
                        index += 1;
                        return (
                            <li key={index}>
                                <button
                                    type="button"
                                    key={index}
                                    onClick={() => {
                                        sendRating(index, content, setRating, setContent)
                                            .then(r => console.log('Received: ', r))
                                    }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={"w-6 h-6 " + (index <= rating ? "text-yellow-300 solid" : "text-gray-300")}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                                    </svg>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default StarRating;