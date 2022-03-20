import React, {useEffect, useRef, useState} from "react";
import toast, {Toaster} from "react-hot-toast";
import StarStatistics from "./StarStatistics";
import {FaEye, FaStar, FaEyeSlash} from "react-icons/fa";
import {apiUrl, captcha, Visibility} from "../App";
import Recaptcha from 'react-google-invisible-recaptcha';
import autosize from 'autosize';


async function sendRating(rating, content, token, visibility, setRating, setContent, setToken, setVisibility) {
    const promise = fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
            "score": rating,
            "content": content,
            "visibility": visibility
        }),
        headers: {
            'Content-Type': 'application/json',
            'Featbee-Captcha': token
        }
    }).then((response) => {
        return response.json()
    }).then((result) => {
        console.log(result)
        if (result.success === false) {
            return Promise.reject("Unsuccessful result")
        }

        setRating(result.score)
        setContent(result.content)
        setVisibility(result.visibility)
        setToken(null)
    });

    toast.remove()
    await toast.promise(promise, {
        loading: 'Sending feedback',
        success: 'Your feedback has been saved',
        error: 'Error saving feedback'
    })

    return promise
}

async function fetchRating(setRating, setContent, setVisibility) {
    return fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            if (result.success === false) {
                console.error(result)
                return null
            }

            setRating(result.score)
            setContent(result.content)
            setVisibility(Visibility[result.visibility] || Visibility.PRIVATE)
            return result
        }).catch((failure) => console.error(failure))
}

const StarRating = (props) => {
    const [rating, setRating] = [props.score, props.setScore];
    const [content, setContent] = useState();
    const [token, setToken] = useState(null);
    const [visibility, setVisibility] = useState(Visibility.PRIVATE)
    const captchaRef = useRef(null);

    useEffect(() => {
        const fetch = async () => await fetchRating(setRating, setContent, setVisibility)

        fetch().then(r => {
            if (r.success !== false) {
                autosize.update(document.querySelector("textarea"))
                toast.remove()
                toast("Your feedback has been restored", {
                    duration: 1050,
                    icon: '👁️‍🗨️'
                })
            }
        })
    }, [])

    useEffect(() => {
        autosize(document.querySelector("textarea"))
    })

    return (
        <div>
            <div
                className={"mt-10 border transition duration-150 ease-in-out focus-within:border-primary border-gray-gray4 p-8 rounded-lg max-w-prose mx-auto"}>
                <div><Toaster/></div>
                <div className="grid grid-rows-1 grid-flow-col gap-4">
                    <div>
                        <label
                            htmlFor={"content"}
                            className={`text-xs text-primary font-light placeholder-gray-gray4 px-2 pt-1.5 cr-only`}
                            hidden>
                            Feedback
                        </label>


                        <div className={"wrap"}>
                            <div style={{float: "left"}}>
                                <button
                                    className={"inline " + (visibility === Visibility.PRIVATE ? "text-gray-400" : "text-green-600")}
                                    type={"button"} onClick={() => {
                                    setVisibility(visibility === Visibility.PUBLIC ? Visibility.PRIVATE : Visibility.PUBLIC)
                                }}>
                                    <div className="grid grid-rows-1 grid-flow-col gap-2 items-center">
                                        {visibility === Visibility.PUBLIC &&
                                            <FaEye style={{display: "inline-block"}} className={"text-md"}/>}
                                        {visibility === Visibility.PRIVATE &&
                                            <FaEyeSlash style={{display: "inline-block"}}/>}
                                        {visibility === Visibility.PUBLIC && <p>Visible to the public</p>}
                                        {visibility === Visibility.PRIVATE && <p>Invisible to the public</p>}
                                    </div>
                                </button>
                            </div>
                            <textarea
                                className={"w-full px-2 pb-1.5 text-primary outline-none text-base font-light rounded-md"}
                                id={"content"}
                                placeholder={"Please, enter your comment here"}
                                style={{marginLeft: 0, paddingLeft: 0, resize: 'none'}}
                                rows={2}
                                value={content || ""}
                                onChange={(value) => setContent(value.target.value)}/>
                        </div>

                        <ul className="flex items-center gap-x-2 mt-1">
                            {[...Array(10)].map((star, index) => {
                                index += 1;
                                return (
                                    <li key={index}>
                                        <button
                                            type="button"
                                            key={index}
                                            onClick={async () => {
                                                if (captcha.enabled && token == null) {
                                                    captchaRef.current
                                                        .execute({async: true})
                                                        .then((token) => {
                                                            if (token == null) {
                                                                toast.error("Failed fetching captcha")
                                                                return
                                                            }

                                                            setToken(token)
                                                            sendRating(index, content, token, visibility, setRating, props.setContent, setToken, props.setVisibility)
                                                        })
                                                } else {
                                                    await sendRating(index, content, token, visibility, setRating, props.setContent, setToken, props.setVisibility)
                                                }

                                            }}>
                                            <FaStar color={index <= rating ? '#FFD54F' : 'gray'}/>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <StarStatistics score={rating}/>
                </div>
            </div>

            {
                captcha.enabled &&
                <Recaptcha onResolved={(token) => setToken(token)} ref={captchaRef} sitekey={captcha.sitekey}/>
            }
        </div>
    );
};

export default StarRating;