import * as d3 from 'd3';

import {MagicView} from './views/MagicView.js';
import {Model} from './Model.js';

const container = d3.select('#magic-container');

const model = new Model();
model.load('data.csv', () => {
    window.magic = new MagicView(model, d3.select('#magic-container')).init();
});