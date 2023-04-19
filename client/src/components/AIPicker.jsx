import React from 'react'
import CustomButton from './CustomButton'

const AIPicker = ({prompt, setPrompt, generatingImg, handleSubmit}) => {
  return (
    <div className='aipicker-container'>
<textarea className='aipicker-textarea' placeholder='Type print prompt' rows={5} value={prompt} onChange={(e)=>{setPrompt(e.target.value)}}>

</textarea>
<div className='flex flex-wrap gap-3'>
{generatingImg?(<CustomButton type="outline" title="Asking AI..." customStyles="text-xs"></CustomButton>):(<><CustomButton type="outline" title="AI Logo" handleClick={()=>handleSubmit('logo')} customStyles="text-xs" ></CustomButton><CustomButton type="filled" title="AI Full" handleClick={()=>handleSubmit('full')} customStyles="text-xs" ></CustomButton></>)}
</div>
    </div>
  )
}

export default AIPicker
