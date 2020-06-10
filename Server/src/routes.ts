import express from 'express';
import Knex from './database/connection';
import PointsController from './controllers/Pointscontroller';
import ItemsController from './controllers/Itemscontroller';


const pointsController = new PointsController();
const itemsController = new ItemsController();

const routes = express.Router();

routes.get('/items', itemsController.index);

routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);


export default routes; 