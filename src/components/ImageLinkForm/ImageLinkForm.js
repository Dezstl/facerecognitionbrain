import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onSubmit}) => {
    return (
        <div>
            <p className='white f3'> {'This Magic Will Dectect Faces. Try it Out.'}</p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-4'>
                <input className='f3 pa2 w-70 center' type='tex' onChange={onInputChange}></input>
                    <button className='w-30 grow f4 link ph3 pv2 dib bg-light-purple' onClick={onSubmit}>Dectect</button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;