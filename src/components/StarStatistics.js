import React, {useEffect, useState} from "react";
import {apiUrl} from "../App";

async function fetchStatistics(setAverage, setCount) {
    return fetch(apiUrl + "/statistics", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.success === false) {
                console.error(result)
                return null
            }

            setAverage(result.averageScore)
            setCount(result.count)
            return result
        }).catch((failure) => console.error(failure))
}

const StarRating = (props) => {
    const [average, setAverage] = useState();
    const [count, setCount] = useState();

    useEffect(() => {
        (async () => await fetchStatistics(setAverage, setCount))()
    }, [props.score])

    return (
        <div className={"transition duration-150 ease-in-out rounded-lg max-w-prose mx-auto"}
             style={{margin: "auto"}}>
            <div className="grid grid-rows-2 grid-flow-col content-around items-center align-center">
                <div>
                    <h1 className={"font-bold text-3xl"}>{average === undefined ? "..." : average.toFixed(2)}</h1>
                </div>
                <div>
                    <p>Feedbacks: {count}</p>
                </div>
            </div>
        </div>
    );
};

export default StarRating;