import express from 'express';
const compression = require('compression');

import serverRenderer from './middleware/renderer';
import * as Loadable from "react-loadable";

const PORT = 3000;
const path = require('path');

const app = express();
const router = express.Router();

app.use(compression());

// root (/) should always serve our server rendered page
router.use('^/$', serverRenderer);

// other static resources should just be served as they are
router.use(express.static(
    path.resolve(__dirname, '..', 'build'),
    { maxAge: '30d' },
));

// anything else should act as our index page
// react-router will take care of everything
router.use('*', serverRenderer);

// tell the app to use the above rules
app.use(router);

// start the app
Loadable.preloadAll().then(() => {
    app.listen(PORT, (error) => {
        if (error) {
            // tslint:disable-next-line:no-console
            return console.log('something bad happened', error);
        }

        // tslint:disable-next-line:no-console
        console.log("listening on " + PORT + "...");
    });
});