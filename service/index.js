const express = require('express');
const app = express();
const useDocsMiddleware = require('./docsGenerator');
const networkService = require('./networkService');

const port = process.env.PORT || 8081;

useDocsMiddleware(app, '/api-docs');

/**
 * @swagger
 * /hotels:
 *   get:
 *     description: Returns hotels near the specified location
 *     parameters:
 *       - name: latitude
 *         in: query
 *         description: latitude of the location to search nearby
 *         schema:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *           example: 10.5
 *       - name: longitude
 *         in: query
 *         description: longitude of the location to search nearby
 *         schema:
 *           type: number
 *           minimum: -180
 *           maximum: 80
 *           example: 20.33
 *     responses:
 *       '200':
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
 */
app.get('/hotels', (req, res) => {
  networkService.getHotels(req.query.latitude, req.query.longitude, req.query.radius).then(function(result) {
    res.status(200).send(result);
  }).catch(function(e) {
    res.status(400).send();
  });
  //res.status(200).send(['place1', 'place2']);
});

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
