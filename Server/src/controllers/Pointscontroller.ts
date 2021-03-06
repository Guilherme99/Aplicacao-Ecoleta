
import  Knex from '../database/connection';
import {Request, Response} from 'express';

class PointsController{
    async create(request:Request, response:Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
    
        } = request.body;
        const trx = await Knex.transaction();
        
        const point = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const insertedIds = await trx('points').insert(point);
        const point_id = insertedIds[0];
        const pointItems = items.map((item_id:number) => {
            return {
                item_id,
                point_id
            };
        })
    
        await trx('point_items').insert(pointItems);

        await trx.commit();
    
        return response.json({id: point_id,...point});
    }
    async show(request:Request, response:Response){
        const {id} = request.params;

        const point = await Knex('points').where('id',id).first();

        if(!point){
            return response.status(400).json({message: "Error"});
        }

        const items = await Knex('items')
        .join('point_items','items.id','=','point_items.item_id')
        .where('point_items.point_id',id)
        .select('items.title');

        return response.json({point, items});
    }
    async index(request:Request, response:Response){
        // const {city, uf, items} = request.query;
        // const parsedItems = String(items)
        // .split(',')
        // .map(item=> Number(item.trim()));

        const points = await Knex('points').select('*');
        // .join('point_items', 'points.id', '=', 'point_items.point_id')
        // .where('point_items.item_id', parsedItems)
        // .where('city', String(city))
        // .where('uf', String(uf))
        // .distinct()
        

        return response.json(points);

    }
}

export default PointsController;