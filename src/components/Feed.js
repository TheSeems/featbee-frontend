import React, {useEffect, useState} from "react";
import {apiUrl} from "../App";
import FeedEntry from "./FeedEntry";
import InfiniteScroll from "react-infinite-scroll-component";

const pageSize = 35

async function fetchFeed(page = 0) {
    return fetch(`${apiUrl}/feed?page=${page}&size=${pageSize}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((response) => response.json());
}

const Feed = (props) => {
    const [lock, setLock] = useState(false)
    const [initial, setInitial] = useState(null)
    const [state, setState] = useState({
        items: Array.from({length: pageSize}),
        page: 1,
        hasMore: true
    })

    const fetchMoreData = () => {
        if (lock) {
            return
        }

        setLock(true)
        fetchFeed(state.page).then((result) => {
            setState({
                items: state.items.concat(result),
                page: state.page + 1,
                hasMore: result.length === pageSize
            })
        }).finally(() => {
            setLock(false)
        })
    }

    useEffect(() => {
        fetchFeed(0).then((result) => {
            if (result.success === false || !(result instanceof Array)) {
                return
            }

            setInitial(result)
            setState({
                items: Array.from({length: pageSize}),
                page: 1,
                hasMore: true
            })
        })
    }, [props.score, props.visibility, props.content])

    console.log(initial)

    return (
        <div id={"feeds"}>
            {initial == null && (
                <h1>Not available at the moment...</h1>
            )}
            {initial != null && initial.map((entry, index) => {
                return (
                    <FeedEntry key={"cmt" + index}
                               score={entry.score}
                               comment={entry.content}/>
                )
            })}
            {(initial != null && initial.length === 0) && (
                <h1>Nobody left their public feedback yet...</h1>
            )}

            <InfiniteScroll
                dataLength={state.items.length}
                next={fetchMoreData}
                hasMore={state.hasMore}
                loader={<br/>}
                endMessage={<br/>}>
                {state.items.map((entry, index) => {
                    if (entry == null) {
                        return null
                    }

                    return (
                        <FeedEntry key={"cmt" + index} score={entry.score} comment={entry.content}/>
                    )
                })}
            </InfiniteScroll>
        </div>
    )
}


export default Feed;