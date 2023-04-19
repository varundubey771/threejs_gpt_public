import React, {useEffect,useState} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import {flushSync} from 'react-dom'


import config from '../config/config'
import state from '../store'
import {download} from '../assets'

import { reader, downloadCanvasToImage } from '../config/helpers';

import { EditorTabs ,FilterTabs,DecalTypes} from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion'
import { AIPicker,CustomButton, ColorPicker, FilePicker, Tab } from '../components'

const Customizer = () => {

  const snap =useSnapshot(state)
  const [file,setFile]=useState('')
  const  [prompt, setPrompt] = useState('')
  const [generatingImg, setGeneratingImg]= useState(false)
  const [activeEditorTab, setActiveEditorTab] = useState("")
  const [activeFilterTab, setActiveFilterTab ]= useState({logoShirt:true,stylishShirt:false})

const handleGoBack = async () => {
flushSync(()=>{
  setActiveEditorTab("")
})
state.intro=true
}

  //show tab content depending on actual tab
  const generateTabContent=()=>{
    switch(activeEditorTab){
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker readFile={readFile} file={file} setFile={setFile}></FilePicker>
case "aipicker":
  return <AIPicker prompt={prompt} setPrompt={setPrompt} generatingImg={generatingImg} handleSubmit={handleSubmit}></AIPicker>
 default:
   return null
    }
  }

const handleSubmit = async (type)=>{
  if(!prompt) return alert("Please enter prompt")
try{
  //call backedn
  setGeneratingImg(true)
  const response = await fetch('http://localhost:8080/api/v1/dalle',{
    method:'POST',
    headers:{'Content-type':'application/json'},
    body:JSON.stringify({
      prompt
    })

  })
console.log("okokokokokokokok")

const data = await response.json()

handleDecals(type, `data:image/png;base64,${data.photo}`)
}
catch (error){
  alert(error)
}
finally{
  setGeneratingImg(false)
  setActiveEditorTab("")
}
}

  const handleActiveFilterTab=(tabName)=>{
    switch(tabName){
case "logoShirt":
  state.isLogoTexture=!activeFilterTab[tabName]
  break
case "stylishShirt":
  state.isFullTexture=!activeFilterTab[tabName]
  break
default:
  state.isFullTexture=false
  state.isLogoTexture=true
  break;


    }
    setActiveFilterTab((prevState)=>{
      return {
        ...prevState,
        [tabName]:!prevState[tabName]
      }
    })


  }
  const handleDecals= (type,result)=>{
const decalType = DecalTypes[type]
state[decalType.stateProperty] = result
if(!activeFilterTab[decalType.filterTab]){
  handleActiveFilterTab(decalType.filterTab)
}

  }
  const readFile = (type)=>{
    reader(file).then((result)=>{
      handleDecals(type,result)
      setActiveEditorTab("")
    })
  }

  return (
<AnimatePresence>
{!snap.intro&&(
  <>
  <motion.div key="custom" className='absolute top-0 left-0 z-10' {...slideAnimation('left')}>
    <div className='flex items-center min-h-screen'>
<div className='editortabs-container tabs'>
{EditorTabs.map((tab)=>(
  <Tab tab={tab} key ={tab.name} handleClick={()=>{setActiveEditorTab(tab.name)}}></Tab>
))}
{generateTabContent()}
</div>
    </div>

  </motion.div>
  <motion.div className='absolute z-10 top-5 right-5' {...fadeAnimation}>
    <CustomButton type="filled" title="Go Back" customStyles="w-fit px-4 py-2.5 font-bold text-sm" handleClick={handleGoBack}></CustomButton>
  </motion.div>
  <motion.div className='filtertabs-container' {...slideAnimation('up')}>
  {FilterTabs.map((tab)=>(
  <Tab tab={tab} isFilterTab isActiveTab={activeFilterTab[tab.name]} key ={tab.name} handleClick={()=>{handleActiveFilterTab(tab.name)}}></Tab>
))}

  </motion.div>

  </>
)}
</AnimatePresence>
  )
}

export default Customizer
