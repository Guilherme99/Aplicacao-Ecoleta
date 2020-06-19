import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import './style.css';
import {FiArrowLeft} from 'react-icons/fi'
import Logo from '../../assets/logo.svg';
import img from '../../../src/assets/oleo.svg';
import {Link, useHistory} from 'react-router-dom';
import {Map, TileLayer, Marker} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';
import api from '../../services/api';
import axios from 'axios';
import Message from '../../components/Message';
import * as Yup from 'yup';

interface Item{
    id:number,
    title:string,
    image__url:string
}

interface IBGERes{
    sigla:string
}
interface IBGEResCidades{
    nome:string
}

const CreatePoint = () => {
    const [items,setItems] = useState<Item[]>([]);
    const [ufs,setUfs] = useState<string[]>([]);
    const [cities,setCities] = useState<string[]>([]);
    const [selectedUf,setSelectedUf] = useState('0');
    const [selectedCity,setSelectedcity] = useState('0');
    const [selectedPosition,setSelectedPosition] = useState<[number,number]>([0,0]);

    const [InitialPosition,setInitialPosition] = useState<[number,number]>([0,0]);

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        whatsapp:''
    })

    const [selectedItems,setSelectedItems] = useState<number[]>([]);

    const [enviado, setEnviado] = useState(false);
    const [isCadastrado, SetIsCadastrado] = useState(false);

    const history = useHistory();

    const schema = Yup.object().shape({
        name: Yup.string().required("Campo obrigatório"),
        email: Yup.string().email().required("Campo obrigatório"),
        whatsapp: Yup.string().required("Campo obrigatório"),
    });

    useEffect(()=> {
        navigator.geolocation.getCurrentPosition(position=>(
            setInitialPosition([position.coords.latitude, position.coords.longitude])
        ))
    },[]);
    useEffect(()=> {
        api.get('items').then(response=>{
            setItems(response.data)
        })
    },[]);

    useEffect(()=> {
        axios.get<IBGERes[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response=>{
            const initials = response.data.map(uf => uf.sigla)
            setUfs(initials);
        })
    },[]);

    useEffect(()=> {
        if(selectedUf==='0'){return;}

        axios.get<IBGEResCidades[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response=>{
            const cities = response.data.map(city => city.nome)
            setCities(cities);
        })
    },[selectedUf]);

    function handleSelectUf (event: ChangeEvent<HTMLSelectElement>){

        const uf = event.target.value;
        setSelectedUf(uf);
    }
    function handleCity (event: ChangeEvent<HTMLSelectElement>){

        const city = event.target.value;
        setSelectedcity(city);
    }
    function handleMapClick(event:LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
        
    }
    function handleInput(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target;
        setFormData({...formData, [name]:value })
    }
    function handleSelectedItem(id:number){
        const already = selectedItems.findIndex(item=>item===id);

        
        if(already>=0){
            
            const filteredItems = selectedItems.filter(item=> item!==id);
            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([...selectedItems, id])
        }
        
    }
    async function handleSubmit(event: FormEvent ){
        event.preventDefault();

        const {name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = {
            name,
            email, 
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }

        schema.isValid(data)
        .then(valid => {
            if(valid){
                (async () => {
                    await api.post('points', data);
       
                    setEnviado(true);
                    SetIsCadastrado(true);
            
                    // alert("Ponto criado");
                    setTimeout(()=> {
                        history.push('/');
                    }, 4000)
                }
                )();
                
            }
            
             
        })

      
    }
    return(
        
        <div id="page-create-point">
          
            <header>
                <img src={Logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/>  ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInput}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="email">email</label>
                        <input 
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleInput}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                        <input 
                            type="text"
                            name="whatsapp"
                            id="whatsapp"
                            onChange={handleInput}
                        />
                    </div>
                </fieldset> 

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={InitialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado (UF) </label>
                                <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                    <option value="0">Selecione uma UF</option>
                                    {
                                        ufs.map(uf => (
                                            <option key={uf} value={uf}>{uf}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="city">Cidade </label>
                                <select name="city" id="city" value={selectedCity} onChange={handleCity}>
                                    <option value="0">Selecione uma Cidade</option>
                                    {
                                        cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))
                                    }
                                </select>
                            </div>
                    </div>
                </fieldset>


                <fieldset>
                    <legend>
                        <h2>Itens de coleção</h2>
                        <span>Selecione um ou mais itens de coleta</span>
                    </legend>

                    <ul className="items-grid">
                        {

                            items.map(item=>{
                                return (
                                    <li 
                                        key={item.id} 
                                        onClick={() => handleSelectedItem(item.id)}
                                        className={selectedItems.includes(item.id)? 'selected' : ''}
                                        >
                                        <img src={item.image__url} alt={item.title} />
                                        <span>{item.title}</span>
                                    </li>
                                )
                            })
                        }
                        
                        
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto</button>
            </form>
            {
                enviado ? <Message corPlanoFundo={isCadastrado? '#1ef14f' : 'red'} Text={isCadastrado? 'Cadastrado com sucesso.' : 'Cadastro não realizado.'} /> : ''
            }
        </div>
    )
}


export default CreatePoint;