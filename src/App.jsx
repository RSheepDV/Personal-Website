
import './App.css'
import './content.css'
import CanvasScene from "./models/canvasScene.jsx";
import Navbar from "./components/navbar";
import ImageCarousel from "./components/imageCarousel/imageGallery";
import GameInfo from "./components/gameInfo/gameInfo.jsx";

function App() {

    return (
        <div>
            <div id={"canvas-background"} />
            <Navbar/>
            <CanvasScene/>
            <div id={"Top"}>
                {/*<div className={"gradientDown"}/>*/}
                <div id={"title"}>
                    <img src={"Logo.png"}/>
                </div>
            </div>
        </div>
    )
}

export default App
