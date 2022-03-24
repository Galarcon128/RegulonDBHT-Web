import React, { useState } from 'react'
import Style from './builder.module.css'
import fields from "./fields.json"
import Autocompletev02 from './Autocompletev02/Autocomplete'
import DataSolver from './DataSolver/DataSolver'
import { SpinnerCircle } from '../../../../components/ui-components/ui_components'
import SearchNLPGC from '../../webServices/nlpGrowthCondition/nlpgc_search'

export default function Builder({
    datasetType,
    datasets,
    queryBox,
    set_queryBox = () => { },
    set_search = () => { }
}) {
    const [_datasetFeature, set_datasetFeature] = useState("")
    const [_nlpgc, set_nlpgc] = useState()
    const [_nlpGCFeature, set_nlpGCFeature] = useState("")
    const [_nlpCondition, set_nlpCondition] = useState("")
    const [_logicConec, set_logicConec] = useState()
    const [_inputActive, set_inputActive] = useState(false)
    const [suggest, setSuggest] = useState()
    const id_autocomplete = "builder_input_text"

    function setAutocomplete_Input(str = "") {
        const inputText = document.getElementById(id_autocomplete)
        if (inputText) {
            const input_REACTION = new CustomEvent('inputTextR', {
                bubbles: true,
                detail: {
                    inputText: str
                }
            });
            inputText.dispatchEvent(input_REACTION);
        }
    }

    return (
        <div >
            <div id='selectorsBuilder' className={Style.gridContainer}>
                <div className={Style.gridItem}>
                    <label htmlFor="datasetFeatures">Dataset Property</label>
                    <br />
                    <select name="datasetFeatures" id="datasetFeatures" style={{ width: "100%" }}
                        onChange={(e) => {
                            set_datasetFeature(e.target.value)
                            if (e.target.value !== 'growthConditions') {
                                setSuggest(DataSolver(e.target.value, datasets))
                            }
                            set_nlpCondition(undefined)
                            setAutocomplete_Input()
                            if (e.target.value === 'growthConditions' || e.target.value === 'nlpGC') {
                                set_inputActive(false)
                            } else {
                                set_inputActive(true)
                            }

                        }}
                    >
                        <option value="0" selected disabled hidden>choose one</option>
                        {
                            fields.datasetsFeatures.map((data, i) => {
                                if (datasetType === "TFBINDING") {
                                    if (data?.value === "NLP Growth Conditions") {
                                        return null
                                    }
                                    return (
                                        <option value={data?.query} key={`${data}_${i}`}>{data?.value}</option>
                                    )
                                } else {
                                    if (datasetType !== "GENE_EXPRESSION") {
                                        if (datasetType === "TSS") {
                                            if (data?.value !== "NLP Growth Conditions" && data?.value !== "RegulonDB TF ID" && data?.value !== "TF Name" && data?.value !== "TF Synonyms" && data?.value !== "TF Gene Name" && data?.value !== "Control Sample ID" && data?.value !== "Experiment Sample ID") {
                                                return (
                                                    <option value={data?.query} key={`${data}_${i}`}>{data?.value}</option>
                                                )
                                            } else {
                                                return null
                                            }
                                        } else {
                                            if (data?.value !== "NLP Growth Conditions" && data?.value !== "RegulonDB TF ID" && data?.value !== "TF Name" && data?.value !== "TF Synonyms" && data?.value !== "TF Gene Name") {
                                                return (
                                                    <option value={data?.query} key={`${data}_${i}`}>{data?.value}</option>
                                                )
                                            } else {
                                                return null
                                            }
                                        }
                                    } else {
                                        if (data?.value !== "Growth Conditions" && data?.value !== "Reference genome" && data?.value !== "Control Sample ID" && data?.value !== "Experiment Sample ID" && data?.value !== "DBxRef ID" && data?.value !== "DBxRef Name" && data?.value !== "RegulonDB TF ID" && data?.value !== "TF Name" && data?.value !== "TF Synonyms" && data?.value !== "TF Gene Name") {
                                            return (
                                                <option value={data?.query} key={`${data}_${i}`}>{data?.value}</option>
                                            )
                                        } else {
                                            return null
                                        }
                                    }
                                }
                            })
                        }
                    </select>
                </div>
                {
                    _datasetFeature.match(/growthConditions/g) &&
                    <div className={Style.gridItem}>
                        <label htmlFor="growthConditions">Growth Condition</label>
                        <br />
                        <select name="growthConditions" id="growthConditions" style={{ width: "100%" }}
                            onChange={(e) => {
                                set_datasetFeature(e.target.value)
                                setSuggest(DataSolver(e.target.value, datasets))
                                setAutocomplete_Input()
                                set_inputActive(true)
                            }}
                        >
                            <option value="0" selected disabled hidden>choose one</option>
                            {
                                fields.growthConditions.map((data, i) => {
                                    return (
                                        <option value={data?.query} key={`${data.value}_${i}`}  >{data.value}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                }
                {
                    _datasetFeature.match(/nlpGC/g) &&
                    <div className={Style.gridItem}>
                        {
                            !_nlpgc
                                ? <div>
                                    <SearchNLPGC keyword='GC[_id]' resoultsData={(data) => { set_nlpgc(data) }} />
                                    <SpinnerCircle />
                                </div>
                                : <div>
                                    <label htmlFor="nlpGConditions">NLP Growth Condition</label>
                                    <br />
                                    <br />
                                    <select name="nlpGConditions" id="nlpGConditions" style={{ width: "100%" }}
                                        onChange={(e) => {
                                            set_nlpCondition(e.target.value)
                                            set_nlpGCFeature(`${_nlpCondition}.value`)
                                            setAutocomplete_Input()
                                            setSuggest(DataSolver(`${_nlpCondition}.value`, _nlpgc))
                                            set_inputActive(true)
                                        }}
                                    >
                                        <option value="0" selected disabled hidden>choose one</option>
                                        {
                                            fields.nlpGC.map((data, i) => {
                                                return (
                                                    <option value={data?.query} key={`${data.value}_${i}`}  >{data.value}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                        }
                    </div>
                }
                {
                    _nlpCondition && _datasetFeature.match(/nlpGC/g)
                        ? <div className={Style.gridItem}>
                            <label htmlFor="nlpGConditions">NLPGC Property</label>
                            <br />
                            <select name="nlpGConditions" id="nlpGConditions" style={{ width: "100%" }}
                                onChange={(e) => {
                                    let q = `${_nlpCondition}.${e.target.value}`
                                    console.log(q);
                                    set_nlpGCFeature(q)
                                    setSuggest(DataSolver(q, _nlpgc))
                                    set_inputActive(true)
                                }}
                            >
                                {
                                    fields.nlpGCProperties.map((data, i) => {
                                        return (
                                            <option value={data?.query} key={`${data.value}_${i}`}  >{data.value}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        : null
                }
            </div>
            <br />
            <div className={Style.gridInput} >
                <div onClick={(e) => {
                    if (!_inputActive) {
                        let selectors = document.getElementById('selectorsBuilder')
                        if (selectors) {
                            let ori = selectors.className
                            selectors.className = ori + " " + Style.shakeShake
                            setTimeout(() => {
                                selectors.className = ori
                            }, 500)

                        }
                    }
                }}>
                    <Autocompletev02 active={_inputActive} suggestions={suggest} id={id_autocomplete} />
                </div>
                <div>
                    <div className={Style.gridLogic} width="100%">
                        <label htmlFor="logicConect">logical connector</label>
                        <select name="logicConect" id="logicConect" style={{ height: "30px" }}
                            onChange={(e) => {
                                set_logicConec(e.target.value)
                            }}
                        >
                            <option value="" selected disabled hidden> choose </option>
                            <option value="AND"  >AND</option>
                            <option value="OR" >OR</option>
                            <option value="NOT" >NOT</option>
                        </select>
                        <button disabled={!_logicConec} style={{ width: "100%", height: "30px", padding: "0" }} 
                            onClick={(e)=>{
                                if(_logicConec){
                                    let inputText = document.getElementById(id_autocomplete)
                                    if(inputText){
                                        inputText = inputText.value
                                        set_queryBox(`(${queryBox}) ${_logicConec} '${inputText}'[${_datasetFeature}]`)
                                    }
                                }
                            }}
                        >ADD</button>
                    </div>
                    <br />
                    <br />
                    <div>
                        <button
                            onClick={()=>{
                                setAutocomplete_Input()
                            }}
                        > clean </button>
                        <button style={{ width: "70%"}} className='accent' > SEARCH </button>
                    </div>
                </div>

            </div>

        </div>
    )
}

