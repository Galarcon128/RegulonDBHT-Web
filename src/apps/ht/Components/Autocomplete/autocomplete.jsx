import React, { Component, useState } from 'react'
import { useLazyQuery } from '@apollo/client';
import Style from "./auto.module.css"
import { QUERY } from './query';

const Autocomplete = ({
    id,
    query,
    set_keyword = () => { },
}) => {
    const [_keyword, setKeyword] = useState()
    const [getSuges, { loading, error, data }] = useLazyQuery(QUERY);
    const matchKeywords = filterData(data?.getDatasetsFromSearch, _keyword, query);
    if (error) {
        console.error(error)
    }
    return (
        <div style={{width: '100%'}}>
            <input
                autoComplete="off"
                id={id}
                type="text"
                className="TextArea"
                onChange={(e) => {
                    let keyword = e.target.value;
                    console.log()
                    if (query) {
                        document.getElementById(`auto_warn${id}`).style.display = "none"
                        if (keyword.length > 0) {
                            setKeyword(keyword)
                            getSuges({
                                variables: {
                                    keyword: "\"" + keyword + "\"[" + query + "]"
                                }
                            })
                        } else {
                            setKeyword(undefined)
                        }
                    } else {
                        document.getElementById(`auto_warn${id}`).style.display = "inline"
                    }

                    set_keyword(keyword);
                }} />
            <div className={Style.result} >
                {
                    matchKeywords && <ul>
                        {
                            matchKeywords.map((keyword, i) => {
                                return (
                                    <li key={`${i}_${keyword}`}
                                    onClick={() =>{
                                        document.getElementById(id).value = keyword
                                        set_keyword(keyword);
                                        setKeyword(keyword);
                                    }}
                                    >
                                        {keyword}
                                    </li>
                                )
                            })
                        }
                    </ul>
                }
                {
                    loading && <ul>Loading suges...</ul>
                }
                <ul id={`auto_warn${id}`} style={{ display: "none", backgroundColor: "yellow" }} >Please select a location in dorpdown</ul>
            </div>
        </div>
    )
}

function filterData(data, keyword, location) {
    if (!location || !keyword || !data) { return undefined }
    let locations = location.split(".")
    if (Array.isArray(data) && !data.length) {
        return undefined
    }
    if (Array.isArray(locations) && !locations.length) {
        return undefined
    }
    let rx = new RegExp(`${keyword.toLowerCase()}`)
    let keywords = []
    try {
        data.forEach(dataset => {
            let _dataset = dataset
            for (let index = 0; index < locations.length; index++) {
                const loc = locations[index].replaceAll(" ", "");
                _dataset = _dataset[loc]
                //console.log(_dataset.length)
                if (typeof _dataset !== "object" || Array.isArray(_dataset)) {
                    if (Array.isArray(_dataset)) {
                        _dataset.forEach(element => {
                            if (rx.test(element.toLowerCase())) {
                                if (!keywords.find(el => el === element)) {
                                    keywords.push(element)
                                }
                            }
                        });
                    } else {
                        let text = _dataset
                        if (rx.test(_dataset.toLowerCase())) {
                            if (!keywords.find(el => el === text)) {
                                keywords.push(_dataset)
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error(error)
    }
    return keywords
}

export default Autocomplete

