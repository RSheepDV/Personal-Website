import './navbar.css'
import {navigationLinks, navigationLogo} from "./navbarConfig";

export default function Navbar(){

    return (
        <header id="navigationBar">
            {navigationLinks.map((link) => (
                <a key={link.href} className="link" href={link.href}>
                    <b>{link.label}</b>
                </a>
            ))}
            <img src={navigationLogo.src} alt={navigationLogo.alt}/>
        </header>
    );
}