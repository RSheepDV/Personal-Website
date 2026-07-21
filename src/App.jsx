
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
                    <img src={"Logo.png"} alt={"MUWUN logo"}/>
                </div>
            </div>
            <section id={"about"} className={"content-container"}>
                <h1>About Me</h1>
                <div className={"centered"}>
                    <GameInfo/>
                </div>
            </section>
            <section id={"projects"} className={"content-container"}>
                <h1>Projects</h1>
                <div className={"centered"}>
                    <ImageCarousel/>
                </div>
            </section>
        </div>
    )
}

export default App
