import React, {useEffect, useState} from "react";
import toast, {Toaster} from "react-hot-toast";
import StarStatistics from "./StarStatistics";
import {FaStar} from "react-icons/fa";

async function sendRating(rating, content, setRating, setContent) {
    toast.remove()

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
                toast.remove()
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
            className={"mt-10 border transition duration-150 ease-in-out focus-within:border-primary border-gray-gray4 p-8 rounded-lg max-w-prose mx-auto"}>
            <div><Toaster/></div>
            <div className="grid grid-rows-1 grid-flow-col gap-4">
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
                        style={{marginLeft: 0, paddingLeft: 0, resize: 'none'}}
                        rows={2}
                        value={content} onChange={handleChanges}
                    />

                    <ul className="flex items-center gap-x-2 mt-1">
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
                                        <FaStar color={index <= rating ? '#FFD54F': 'gray'}/>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <StarStatistics score={rating}/>
            </div>
        </div>
    );
};

export default StarRating;