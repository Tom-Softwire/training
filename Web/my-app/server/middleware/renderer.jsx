import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom';
import Loadable from 'react-loadable';

import App from '../../src/containers/App.tsx';

import manifest from '../../build/asset-manifest.json';
const extractAssets = (assets, chunks) => Object.keys(assets)
    .filter(asset => chunks.indexOf(asset.replace('.js', '')) > -1)
    .map(k => assets[k]);

const path = require("path");
const fs = require("fs");

export default (req, res, next) => {

    const filePath = path.resolve(__dirname, '..', '..', 'build', 'index.html');

    fs.readFile(filePath, 'utf8', (err, htmlData) => {
        if (err) {
            // tslint:disable-next-line:no-console
            console.error('err', err);
            return res.status(404).end()
        }

        const modules = [];

        const html = ReactDOMServer.renderToString(
            <Loadable.Capture report={moduleName => modules.push(moduleName)}>
                <StaticRouter location={req.baseUrl} context={{}}>
                    <App />
                </StaticRouter>
            </Loadable.Capture>
        );

        const extraChunks = extractAssets(manifest, modules)
            .map(c => `<script type="text/javascript" src="/${c}"></script>`);

        return res.send(
            htmlData
                .replace(
                    '<div id="root"></div>',
                    `<div id="root">${html}</div>`
                )
                .replace(
                    '</body>',
                    extraChunks.join('') + '</body>'
                )
        );

    });
}