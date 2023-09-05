import { useEffect, useState } from "react";
import './preview.css';

const Preview = (props) => {
    const [file, setFile] = useState()
    const getPreview = () => {
        const reader = new FileReader();
        reader.readAsDataURL(props.file);
        reader.onloadend = () =>{
            setFile(reader.result)
        }
    }

    useEffect(()=> {
        getPreview()
    },[]);

    return props.primary ? 
        <img src={file} alt="hhhh" className="project-photo-preview-primary" />:
        <img src={file} alt="hhhh" className="project-photo-preview-secondary" />
}

export default Preview;