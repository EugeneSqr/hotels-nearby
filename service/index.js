const express = require('express');
const cors = require('cors');
const app = express();
const useDocsMiddleware = require('./docsGenerator');
const adaptPromiseHandler = require('./promiseHandlerAdapter');
const {
  handleGetHotels,
  handleGetHotelDetails,
} = require('./httpRequestHandlers');

const port = process.env.PORT || 8081;

app.use(cors());
useDocsMiddleware(app, '/api-docs');
/**
 * @swagger
 * definitions:
 *   latitude:
 *     type: number
 *     minimum: -90
 *     maximum: 90
 *     example: 10.5
 *   longitude:
 *     type: number
 *     minimum: -180
 *     maximum: 180
 *     example: 20.33
 *   radius:
 *     type: number
 *     minimum: 50
 *     maximum: 5000
 *     example: 2000
 *   id:
 *     type: string
 *     example: '643jx7ps-0164bd3f8b3d00604a1a575fff76d2cb'
 *   name:
 *     type: string
 *     example: 'Mechta'
 *   context:
 *     type: string
 *     example: 'Zmxvdy1pZD05Njg...VzJfMTU3NjQ4MzA1MTI0NV85NzM4XzMwMjkmcmFuaz0w'
 *
 *   address:
 *     type: string
 *     example: 'prospekt Gagarina, 54, Nizhniy Novgorod, 603057, Russia'
 *   phone:
 *     type: string
 *     example: '+78314399949'
 *   email:
 *     type: string
 *     example: 'hotel.mechta2012@yandex.ru'
 *   website:
 *     type: string
 *     example: 'http://www.admgor.nnov.ru'
 */

/**
 * @swagger
 * /hotels:
 *   get:
 *     description: Returns hotels near the specified location
 *     parameters:
 *       - name: latitude
 *         in: query
 *         required: true
 *         description: latitude of the location to search nearby
 *         schema:
 *           $ref: '#/definitions/latitude'
 *       - name: longitude
 *         in: query
 *         required: true
 *         description: longitude of the location to search nearby
 *         schema:
 *           $ref: '#/definitions/longitude'
 *       - name: radius
 *         in: query
 *         required: true
 *         description: radius of the area to search
 *         schema:
 *           $ref: '#/definitions/radius'
 *     responses:
 *       200:
 *         description: A successful pull of the list of hotels near the
 *           specified location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 properties:
 *                   id:
 *                     $ref: '#/definitions/id'
 *                   name:
 *                     $ref: '#/definitions/name'
 *                   latitude:
 *                     $ref: '#/definitions/latitude'
 *                   longitude:
 *                     $ref: '#/definitions/longitude'
 *                   context:
 *                     $ref: '#/definitions/context'
 *       400:
 *         description: A failed attempt of getting the hotels list due to
 *           invalid input arguments
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Invalid latitude
 *       500:
 *         description: An unexpected server error
 */
app.get('/hotels', adaptPromiseHandler(handleGetHotels));

/**
 * @swagger
 * /hotels/:id:
 *   get:
 *     description: Returns hotel details
 *     parameters:
 *       - name: id
 *         in: path
 *         require: true
 *         description: hotel id
 *         schema:
 *           $ref: '#/definitions/id'
 *       - name: context
 *         in: query
 *         require: true
 *         description: location context obtained from hotels list request
 *         schema:
 *           $ref: '#/definitions/context'
 *     responses:
 *       200:
 *         description: A successful pull the hotel details
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 id:
 *                   $ref: '#/definitions/id'
 *                 name:
 *                   $ref: '#/definitions/name'
 *                 latitude:
 *                   $ref: '#/definitions/latitude'
 *                 longitude:
 *                   $ref: '#/definitions/longitude'
 *                 address:
 *                   $ref: '#/definitions/address'
 *                 phone:
 *                   $ref: '#/definitions/phone'
 *                 email:
 *                   $ref: '#/definitions/email'
 *                 website:
 *                   $ref: '#/definitions/website'
 *       400:
 *         description: A failed attempt of getting the hotel details due to
 *           invalid input arguments
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Id is missing
 *       500:
 *         description: An unexpected server error
 */
app.get('/hotels/:id', adaptPromiseHandler(handleGetHotelDetails));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
