import React from "react";
import {FaStar} from "react-icons/fa";
import ReactMarkdown from 'react-markdown'

const FeedEntry = (props) => {
    return (
        <div className={"focus-within:border-primary border-gray-gray4 p-4 rounded-lg max-w-xs mx-auto"}
             style={{overflowWrap: "anywhere"}}>
            <div className="grid grid-rows-1 grid-flow-col gap-4">
                <div>
                    <ul className="flex items-center gap-x-2 mt-1" style={{opacity: "45%"}}>
                        {[...Array(10)].map((star, index) => {
                            index += 1;
                            return (
                                <li key={index}>
                                    <button type="button" key={index} disabled>
                                        <FaStar color={index <= props.score ? '#FFD54F' : 'gray'}/>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <div
                        className={"w-full px-2 pb-1.5 text-primary outline-none text-base text-left font-light rounded-md"}
                        style={{marginLeft: 0, paddingLeft: 0, resize: 'none'}}>
                        <ReactMarkdown>{props.comment}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default FeedEntry;