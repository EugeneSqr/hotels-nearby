const express = require('express');
const app = express();
const useDocsMiddleware = require('./docsGenerator');
const adaptPromiseHandler = require('./promiseHandlerAdapter');
const {
  handleGetHotels,
} = require('./httpRequestHandlers');

const port = process.env.PORT || 8081;

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
 *         required: false
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
 *                     type: string
 *                     example: 643ufp22-f2eb834f0cc944efb0b2a71a0cede90c
 *                   name:
 *                     type: string
 *                     example: Grand Hotel Oka
 *                   latitude:
 *                     $ref: '#/definitions/latitude'
 *                   longitude:
 *                     $ref: '#/definitions/longitude'
 *       400:
 *         description: A failed attempt of getting the hotels list due to
 *           invalid input arguments
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Invalid latitude
 */
app.get('/hotels', adaptPromiseHandler(handleGetHotels));

/**
 * @swagger
 * /hotels/:id:
 *   get:
 *     description: test
 *
 */
app.get('/hotels/:id', (req, res) => {
  res.status(200).send({id: 'test'});
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
