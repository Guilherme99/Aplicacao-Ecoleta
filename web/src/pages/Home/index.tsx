import React from 'react';
import {FiLogIn} from 'react-icons/fi';
import './style.css';
import Logo from '../../assets/logo.svg';
import {Link} from 'react-router-dom'
const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={Logo} alt="Ecoleta"/>
                </header>
                
                <main>
                    <h1>Seu marketplace de coleta de resíduos</h1>
                    <p>Contribuir com as pessoas para encontrarem pontos de coleta de forma eficiente. </p>

                    
                <Link to="CreatePoint">
                    <span> <FiLogIn/> </span>
                    <strong>Cadastre um ponto de coleta</strong>
                </Link>

                </main>

            </div>
        </div>
    )
}

export default Home;